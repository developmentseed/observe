import querystring from 'querystring'

import * as Keychain from 'react-native-keychain'
import delay from 'delay'
import forge from 'node-forge'
import OAuth from 'oauth-1.0a'
import pEvent from 'p-event'
import pTimeout from 'p-timeout'
import CookieManager from 'react-native-cookies'
import Config from 'react-native-config'
import { Linking } from 'react-native'
import { checkInternetConnection } from 'react-native-offline'
import url from 'url'

import fetch from '../utils/fetch'

const oauth = OAuth({
  consumer: {
    key: Config.OAUTH_CONSUMER_KEY,
    secret: Config.OAUTH_CONSUMER_SECRET
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (base, key) => {
    const hmac = forge.hmac.create()

    hmac.start('sha1', key)
    hmac.update(base)

    return forge.util.encode64(hmac.digest().getBytes())
  }
})

let preAuthorizing = false

async function waitForPreauthorization () {
  try {
    // eslint-disable-next-line no-unmodified-loop-condition
    while (preAuthorizing) {
      await delay(100)
    }

    return Promise.resolve()
  } catch (err) {
    return Promise.reject(err)
  }
}

/**
 * Perform pre-authentication for resources that require authentication prior
 * to being able to fetch request tokens.
 */
export async function preAuth () {
  if (!await checkInternetConnection()) {
    // return early if not connected
    return false
  }

  if (preAuthorizing) {
    try {
      // allow 5 seconds for active preauthorization to complete (after which
      // whatever is waiting will be able to continue)
      await pTimeout(waitForPreauthorization(), 5000)

      console.log('alternate preAuthorization succeeded')

      return true
    } catch (err) {
      console.log('alternative preAuthorization timed out or failed', err)

      return false
    }
  }

  if (Config.PREAUTH_URL == null) {
    return true
  }

  try {
    preAuthorizing = true

    // check if we're still authenticated; if not, open a browser window
    const rsp = await fetch(Config.API_URL + '?preauth', {
      method: 'HEAD',
      // NOTE: this doesn't appear to work on React Native, so we check URLs instead
      redirect: 'error'
    }, false)

    // presence of trailing slashes may vary
    if (rsp.url.startsWith(Config.API_URL)) {
      return true
    }

    await Linking.openURL(Config.PREAUTH_URL)

    // TODO MobileSafari on iOS currently doesn't redirect when preauth is
    // involved (perhaps due to the way the redirect is presented?)

    const evt = await pEvent(Linking, 'url', {
      rejectionEvents: []
    })

    console.log('preauthorization completed.')

    // yes, this is deprecated since Node 11.0.0; node-url doesn't match the
    // URL constructor properly
    // https://github.com/defunctzombie/node-url/issues/37
    const { query } = url.parse(evt.url, true) // eslint-disable-line node/no-deprecated-api

    for (const key in query) {
      await Keychain.resetInternetCredentials(Config.PREAUTH_URL)
      await Keychain.setInternetCredentials(
        Config.PREAUTH_URL,
        key,
        query[key]
      )

      await CookieManager.setFromResponse(
        Config.API_URL,
        `${key}=${query[key]}`
      )
    }

    console.log('checking credentials')

    const rsp2 = await fetch(Config.API_URL + '?preauth2', {
      method: 'HEAD',
      redirect: 'error'
    }, false)

    if (!rsp2.url.startsWith(Config.API_URL)) {
      console.warn('preauthorization failed, clearing (preauth) credentials')

      await Keychain.resetInternetCredentials(Config.PREAUTH_URL)
      await CookieManager.clearAll()

      return false
    }

    console.log('preauthorization succeeded')

    return true
  } catch (err) {
    console.error(err)
    return false
  } finally {
    preAuthorizing = false
  }
}

/**
 * Populate additional headers according to endpoint requirements.
 */
export async function getAdditionalHeaders (url) {
  const headers = {}

  if (
    Config.PREAUTH_URL != null &&
    url.startsWith(Config.API_URL) &&
    (await Keychain.hasInternetCredentials(Config.PREAUTH_URL))
  ) {
    const { username, password } = await Keychain.getInternetCredentials(
      Config.PREAUTH_URL
    )

    headers.Cookie = `${username}=${password}`
  }

  return headers
}

/**
 * Populate OAuth headers if authorized.
 */
export async function getOAuthHeaders (url, method = 'GET', body = null) {
  if (await isAuthorized()) {
    const {
      username: accessToken,
      password: accessTokenSecret
    } = await Keychain.getInternetCredentials(Config.API_URL)

    return oauth.toHeader(
      oauth.authorize(
        {
          url,
          method,
          body
        },
        {
          key: accessToken,
          secret: accessTokenSecret
        }
      )
    )
  }

  return {}
}

/**
 * Get authentication headers.
 */
export async function getAuthHeaders (url, method, data) {
  return {
    ...(await getOAuthHeaders(url, method, data)),
    ...(await getAdditionalHeaders(url))
  }
}

/**
 * Perform the OAuth dance, authorizing us (the app) to make API calls on behalf of a user.
 */
export async function authorize () {
  // perform pre-authentication if necessary
  const canConnect = await preAuth()

  if (!canConnect) {
    throw new Error('Not pre-authorized.')
  }

  // 1. Fetch a request token
  const rsp = await fetch(Config.OAUTH_TOKEN_URL, {
    headers: oauth.toHeader(
      oauth.authorize({
        url: Config.OAUTH_TOKEN_URL,
        method: 'GET'
      })
    ),
    redirect: 'error'
  })

  const responseBody = await rsp.text()

  const {
    oauth_token: requestToken,
    oauth_token_secret: requestTokenSecret
  } = querystring.parse(responseBody)

  if (requestToken == null) {
    console.error(
      'Response body did not contain an OAuth request token',
      responseBody
    )
    throw new Error('Response body did not contain an OAuth request token')
  }

  // 2. Ask the user to authorize us
  await Linking.openURL(
    `${
      Config.OAUTH_AUTHORIZE_URL
    }?oauth_token=${requestToken}&oauth_callback=${encodeURIComponent(
      'observe://osm'
    )}`
  )

  // 3. Receive a callback notifying us that we've been authorized
  const evt = await pEvent(Linking, 'url', {
    rejectionEvents: []
  })

  // yes, this is deprecated since Node 11.0.0; node-url doesn't match the
  // URL constructor properly
  // https://github.com/defunctzombie/node-url/issues/37
  const { oauth_token: authorizedToken } = url.parse(evt.url, true).query // eslint-disable-line node/no-deprecated-api

  // check if the token that was authorized is the request token we provided
  if (authorizedToken !== requestToken) {
    throw new Error('Request token did not match authorized token.')
  }

  // 4. Fetch an access token (using the request token)
  const accessTokenResponse = await fetch(Config.OAUTH_ACCESS_TOKEN_URL, {
    headers: oauth.toHeader(
      oauth.authorize(
        {
          url: Config.OAUTH_ACCESS_TOKEN_URL,
          method: 'GET'
        },
        {
          key: requestToken,
          secret: requestTokenSecret
        }
      )
    )
  })

  const {
    oauth_token: accessToken,
    oauth_token_secret: accessTokenSecret
  } = querystring.parse(await accessTokenResponse.text())

  // update credentials
  await Keychain.resetInternetCredentials(Config.API_URL)
  await Keychain.setInternetCredentials(
    Config.API_URL,
    accessToken,
    accessTokenSecret
  )
}

export async function clearCredentials () {
  if (Config.PREAUTH_URL != null) {
    await Keychain.resetInternetCredentials(Config.PREAUTH_URL)
    await CookieManager.clearAll()
  }

  await Keychain.resetInternetCredentials(Config.API_URL)
}

export async function isAuthorized () {
  // TODO cache this with a TTL, since it's called on every state change
  return Keychain.hasInternetCredentials(Config.API_URL)
}
