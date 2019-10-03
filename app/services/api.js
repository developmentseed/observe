import { quadkeyToTile, tileToBBOX } from '@mapbox/tilebelt'
import Config from 'react-native-config'
import osmtogeojson from 'osmtogeojson'
import DOMParser from 'xmldom'
import xml2js from 'react-native-xml2js'
import RNFetchBlob from 'rn-fetch-blob'

import { bboxToString } from '../utils/bbox'
import fetch from '../utils/fetch'
import { filterRelations } from '../utils/filter-xml'
import { getOAuthHeaders, getAuthHeaders } from './auth'
import {
  AuthError,
  ChangesetParseError,
  ChangesetNotFoundError,
  OsmChangeError,
  UnknownServerError,
  UploadNetworkError,
  VersionMismatchError,
  FeatureNotFoundError,
  FeatureDeletedError
} from '../utils/errors'
import PQueue from 'p-queue'

const mapSlug = Config.API_URL + '/api/0.6/map'
const changesetSlug = Config.API_URL + '/api/0.6/changeset'
const userSlug = Config.API_URL + '/api/0.6/user'

const notPermittedError = 'You have not permitted the application access to this facility'
const couldNotAuthError = 'Couldn\'t authenticate you'

const XML_PARSER = new DOMParser.DOMParser()

export async function saveDataForTile (tile) {
  const viewport = tileToBBOX(quadkeyToTile(tile))
  const bbox = [[viewport[2], viewport[3]], [viewport[0], viewport[1]]]

  const url = `${mapSlug}/?bbox=${bboxToString(bbox)}`
  const path = `${RNFetchBlob.fs.dirs.DocumentDir}/${tile.slice(0, 8)}/${tile}.osm.xml`
  const tmpPath = `${path}.tmp`
  const rsp = await RNFetchBlob.config({
    followRedirect: false,
    path: tmpPath
  }).fetch('GET', url, {
    ...await getOAuthHeaders(url)
  })

  if (rsp.info().status !== 200) {
    console.log(`${url} failed with status code ${rsp.info().status}: ${await rsp.text()}`)
    throw new Error(`Request to ${url} failed with status code ${rsp.info().status}`)
  }
  const stat = await RNFetchBlob.fs.stat(rsp.path())

  // once we are sure the file is fully downloaded, we move it to its final location
  // so that readers never get a half-written file.
  try {
    await RNFetchBlob.fs.unlink(path)
  } catch (err) {
    console.warn('File unlink failed', err)
  }
  await RNFetchBlob.fs.mv(tmpPath, path)
  return stat.size
}

export async function getDataForBbox (bbox) {
  const url = `${mapSlug}/?bbox=${bboxToString(bbox)}`

  const response = await fetch(url, {
    headers: await getOAuthHeaders(url),
    redirect: 'manual'
  })

  if (response.url != null && !response.url.startsWith(Config.API_URL)) {
    throw new Error(`Request to ${url} resulted in an unexpected redirect to ${response.url}`)
  }

  if (response.status !== 200) {
    console.log(`${url} failed with status code ${response.status}: ${await response.text()}`)
    throw new Error(`Request to ${url} failed with status code ${response.status}`)
  }

  const data = await response.text()
  console.log(data)
  const xmlData = XML_PARSER.parseFromString(data, 'text/xml')
  return osmtogeojson(filterRelations(xmlData), { flatProperties: true, wayRefs: true })
}

/**
 * API service to get the details of the current user who is logged in
 * @return {Object} user details containing name, id, account start date, changeset count, and gravatar
 */
export async function getUserDetails () {
  try {
    const url = `${userSlug}/details`

    const headers = await getOAuthHeaders(url)
    headers['Accept'] = 'application/xml'

    const response = await fetch(url, { headers })
    const data = await response.text()

    if (data === notPermittedError || data === couldNotAuthError || response.status !== 200) {
      throw new AuthError(undefined, data)
    } else {
      const jsonData = await xml2jsonPromise(data)
      return jsonData
    }
  } catch (err) {
    console.log(err)
  }
}

function xml2jsonPromise (data) {
  const xml2json = new xml2js.Parser()
  return new Promise((resolve, reject) => {
    xml2json.parseString(data, (err, json) => {
      if (err) {
        reject(err)
      } else {
        resolve(reshapeUserJSON(json))
      }
    })
  })
}

function reshapeUserJSON (json) {
  const userDetails = {
    username: json.osm.user[0].$.display_name || null,
    uid: json.osm.user[0].$.id || null,
    account_created: json.osm.user[0].$.account_created || null,
    changesets_count: json.osm.user[0].changesets[0].$.count || null,
    image: (json.osm.user[0].img && json.osm.user[0].img[0].$.href) || null,
    description: json.osm.user[0].description[0] || null
  }
  return userDetails
}

/**
 * Function receives changesetXML and calls OSM API to create a new changeset.
 * @param {XML} changesetXML
 * @returns {Number} changeset id
 */
export async function createChangeset (changesetXML) {
  const url = `${changesetSlug}/create`
  const headers = await getAuthHeaders(url, 'PUT', changesetXML)
  let response
  try {
    response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: changesetXML
    })
  } catch (e) {
    throw new UploadNetworkError(undefined, e)
  }

  const responseText = await response.text()
  switch (response.status) {
    case 400:
      throw new ChangesetParseError(undefined, responseText)
    case 401:
      throw new AuthError(undefined, responseText)
    case 405:
      throw new ChangesetParseError(undefined, responseText)
    case 500:
      throw new UnknownServerError(undefined, responseText)
    default:
      return responseText
  }
}

/**
 * @param {XML} changeXML
 * @param {Number} changesetId
 */
export async function uploadOsmChange (changeXML, changesetId) {
  const url = `${changesetSlug}/${changesetId}/upload`
  let response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: await getAuthHeaders(url, 'POST', changeXML),
      body: changeXML
    })
  } catch (e) {
    throw new UploadNetworkError(undefined, e)
  }

  const responseText = await response.text()
  switch (response.status) {
    case 400:
      throw new OsmChangeError(undefined, responseText)
    case 404:
      throw new ChangesetNotFoundError(undefined, responseText)
    case 409:
      if (responseText.startsWith('Version mismatch')) {
        throw new VersionMismatchError(undefined, responseText)
      }
      throw new ChangesetNotFoundError(undefined, responseText)
    default:
      return responseText
  }
}

/**
 * @param {Number} changesetId
 */
export async function closeChangeset (changesetId) {
  const url = `${changesetSlug}/${changesetId}/close`
  let response
  try {
    response = await fetch(url, {
      method: 'PUT',
      headers: await getAuthHeaders(url, 'PUT')
    })
  } catch (e) {
    throw new UploadNetworkError(undefined, e)
  }
  const data = await response.text()
  return data
}

/**
 * Fetches the geojson representation of a feature from the API
 * @param {String} featureType
 * @param {Integer} featureId
 * @returns {Object} FeatureCollection
 */
export async function getFeature (featureType, featureId) {
  const url = featureType === 'way' ? `${Config.API_URL}/api/0.6/${featureType}/${featureId}/full` : `${Config.API_URL}/api/0.6/${featureType}/${featureId}`
  let response
  try {
    response = await fetch(url, {
      method: 'GET'
    })
  } catch (e) {
    throw new Error(e)
  }

  const data = await response.text()
  if (response.status === 404) {
    throw new FeatureNotFoundError(undefined, data)
  } else if (response.status === 410) {
    // feature is deleted
    throw new FeatureDeletedError(undefined, data)
  } else if (response.status === 200) {
    const xmlData = new DOMParser.DOMParser().parseFromString(data, 'text/xml')
    return osmtogeojson(xmlData, { flatProperties: true, wayRefs: true })
  } else {
    throw new UnknownServerError(undefined, data)
  }
}

/**
 * Fetches a featureCollection of nodes belonging to a featureId
 * If the latest version does not match `version`, returns a new VersionMismatchError()
 * @param {String} featureId
 * @param {String} version
 * @returns {Object} FeatureCollection of nodes
 */
export async function getMemberNodes (featureId, version) {
  const nodesToFetch = []
  const nodeCollection = {
    'type': 'FeatureCollection',
    'features': []
  }
  const queue = new PQueue({
    concurrency: 4
  })

  try {
    const fc = await getFeature('way', featureId)
    const feature = fc.features[0]
    if (Number(feature.properties.version) !== Number(version)) {
      throw new VersionMismatchError(undefined, 'The feature has a different version upstream')
    } else {
      feature.properties.ndrefs.forEach(node => {
        nodesToFetch.push(getFeature.bind(null, 'node', node))
      })
      return queue.addAll(nodesToFetch)
        .then(data => {
          data.forEach(d => {
            nodeCollection.features.push(d.features[0])
          })
          return nodeCollection
        })
        .catch(err => {
          throw err
        })
    }
  } catch (error) {
    throw error
  }
}
