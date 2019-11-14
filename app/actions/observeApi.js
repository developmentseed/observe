import * as types from './actionTypes'
import * as api from '../services/observe-api'

export function setObserveAPIToken (token) {
  return {
    type: types.SET_OBSERVE_API_TOKEN,
    token
  }
}

export function getProfile () {
  return async dispatch => {
    await dispatch(api.getProfile())
  }
}
