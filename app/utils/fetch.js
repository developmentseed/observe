import { Platform } from 'react-native'

import retry from 'p-retry'

import { getAdditionalHeaders, preAuth } from '../services/auth'
import Config from 'react-native-config'

export default async function wrappedFetch (
  url,
  options = {},
  preAuthAndRetry = true
) {
  if (Config.PREAUTH_URL == null || !url.startsWith(Config.API_URL)) {
    // not accessing protected resources
    return fetch(url, options)
  }

  return retry(
    async () => {
      const rsp = await fetch(url, {
        ...options,
        headers: {
          ...Platform.select({
            android: {
              ...(options.headers || {}),
              ...(await getAdditionalHeaders(url))
            },
            ios: options.headers
          })
        }
      })

      if (
        preAuthAndRetry &&
        rsp.url !== url &&
        !rsp.url.startsWith(Config.API_URL)
      ) {
        // we got transparently redirected

        console.log('preauthorizing prior to retrying')
        await preAuth()

        throw new Error('Preauthorization required')
      }

      return rsp
    },
    {
      retries: 2
    }
  )
}
