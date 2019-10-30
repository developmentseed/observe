import { store } from '../utils/store'
import Config from 'react-native-config'
import { ObserveError } from '../utils/errors'
import qs from 'qs'

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
    throw new ObserveError('Not logged in to Observe API') // FIXME: create error class
  }
  let fetchOpts = {
    headers: {
      'Authorization': token
    }
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
  // FIXME: look into whether we should do more error handling here,
  // or in wrapper functions
  return fetch(url, fetchOpts)
}

export async function getProfile () {
  try {
    const response = await callAPI('/profile')
    const data = await response.json()
    console.log('data', data)
  } catch (err) {
    console.log('error fetching profile', err)
  }
}
