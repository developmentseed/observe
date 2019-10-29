import * as types from './actionTypes'
import { getProfile as apiGetProfile } from '../services/observe-api'

export function setObserveAPIToken (token) {
  return {
    type: types.SET_OBSERVE_API_TOKEN,
    token
  }
}

export function getProfile () {
  return async dispatch => {
    await dispatch(apiGetProfile())
  }
}
