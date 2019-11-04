import { store } from '../utils/store'
import Config from 'react-native-config'
import { ObserveError, ObserveAPIError } from '../utils/errors'
import qs from 'qs'
import { getTraceGeoJSON } from '../utils/traces'

/**
 * Base function to call the Observe API. Ideally, you would not
 * use this function directly from the outside.
 *
 * @param {String} path - Path to endpoint, beginning with a '/', eg. '/traces'
 * @param {String} method - Method to use for request, eg. GET, POST, DELETE, PATCH. Defaults to GET.
 * @param {Object} data - object with data to send with the request
 */
export async function callAPI (path, method = 'GET', data) {
  let url = `${Config.OBSERVE_API_URL}${path}`
  const token = store.getState().observeApi.token
  if (!token) {
    console.log('no token found!')
    throw new ObserveError('Not logged in to Observe API') // FIXME: create error class
  }
  let fetchOpts = {
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    method
  }
  let queryParams
  if (data) {
    if (method === 'GET') { // for GET, add data to URL querystring
      queryParams = qs.stringify(data)
      url = url + `?${queryParams}`
    } else { // for all non-GET methods, send data as a JSON string in body
      fetchOpts.body = JSON.stringify(data)
    }
  }

  try {
    console.log('opts', url, fetchOpts)
    const response = await fetch(url, fetchOpts)
    const data = await response.json()
    console.log('response data', data, response.status)
    if (response.status > 400) {
      throw new ObserveAPIError(data.message, response.status)
    } else {
      return data
    }
  } catch (err) {
    console.log('fetch to API failed, network error', err)
    // FIXME: throw a NetworkError or so
  }
}

export async function getProfile () {
  try {
    const data = await callAPI('/profile')
    console.log('data', data)
  } catch (err) {
    console.log('error fetching profile', err)
  }
}

export async function uploadTrace (trace) {
  const traceGeoJSON = getTraceGeoJSON(trace)
  const data = await callAPI('/traces', 'POST', {'tracejson': traceGeoJSON})
  return data.properties.id
}
