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
    try {
      const user = await api.getProfile(dispatch)
      return {
        type: types.OBSERVE_API_PROFILE_SUCCESS,
        user
      }
    } catch (error) {
      return {
        type: types.OBSERVE_API_PROFILE_ERROR,
        error
      }
    }
  }
}

export function logoutUser () {
  return {
    type: types.OBSERVE_API_LOGOUT
  }
}
