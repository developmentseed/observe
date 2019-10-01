import * as types from './actionTypes'

export function setNotification ({ level, message }) {
  return {
    type: types.SET_NOTIFICATION,
    level: level || 'info',
    message
  }
}

export function unsetNotification () {
  return {
    type: types.UNSET_NOTIFICATION
  }
}
