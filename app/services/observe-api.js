import { store } from '../utils/store'
import Config from 'react-native-config'
import { ObserveAPIError } from '../utils/errors'
import qs from 'qs'
import { getTraceGeoJSON } from '../utils/traces'
import { logoutUser } from '../actions/observeApi'

/**
 * Base function to call the Observe API. Ideally, you would not
 * use this function directly from the outside.
 *
 * @param {Function} dispatch - Dispatch function, so that actions can be called
 * @param {String} path - Path to endpoint, beginning with a '/', eg. '/traces'
 * @param {String} method - Method to use for request, eg. GET, POST, DELETE, PATCH. Defaults to GET.
 * @param {Object} data - object with data to send with the request
 */
export async function callAPI (dispatch, path, method = 'GET', data) {
  let url = `${Config.OBSERVE_API_URL}${path}`
  const token = store.getState().observeApi.token
  if (!token) {
    throw new ObserveAPIError('Waiting for authorization', 403) // FIXME: create error class
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
    const response = await fetch(url, fetchOpts)
    const data = await response.json()
    if (response.status === 401) { // token is expired or invalid, logout user
      dispatch(logoutUser())
    }
    if (response.status > 400) {
      throw new ObserveAPIError(data.message, response.status)
    } else {
      return data
    }
  } catch (err) {
    console.log('fetch to API failed', err)
    throw err
    // FIXME: throw a NetworkError or so
  }
}

export async function getProfile (dispatch) {
  return callAPI(dispatch, '/profile')
}

export async function uploadTrace (dispatch, trace) {
  const traceGeoJSON = getTraceGeoJSON(trace)
  const data = await callAPI(dispatch, '/traces', 'POST', { 'tracejson': traceGeoJSON })
  return data.properties.id
}
