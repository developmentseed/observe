import * as types from './actionTypes'

export const setAuthorized = isAuthorized => ({
  type: types.SET_AUTHORIZED,
  isAuthorized
})
