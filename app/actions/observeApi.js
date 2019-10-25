import * as types from './actionTypes'

export function setObserveAPIToken (token) {
  return {
    type: types.SET_OBSERVE_API_TOKEN,
    token
  }
}
