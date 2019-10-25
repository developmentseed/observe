import * as types from './actionTypes'
import { getUserDetails } from '../services/api'
import { authorize, clearCredentials } from '../services/auth'
import { setNotification } from './notification'

export function loadUserDetails () {
  return async dispatch => {
    dispatch(loadingUserDetails())
    try {
      const userDetails = await getUserDetails()
      dispatch(loadedUserDetails(userDetails))
    } catch (err) {
      dispatch(setNotification({ level: 'error', message: 'Error fetching user details' }))
      dispatch(errorLoadingUserDetails(err))
    }
  }
}

function loadingUserDetails () {
  return {
    type: types.LOADING_USER_DETAILS
  }
}

function loadedUserDetails (details) {
  return {
    type: types.LOADED_USER_DETAILS,
    details
  }
}

function errorLoadingUserDetails (error) {
  return {
    type: types.ERROR_LOADING_USER_DETAILS,
    error
  }
}
function clearUserDetails () {
  return {
    type: types.CLEAR_USER_DETAILS
  }
}
export function reset () {
  return async dispatch => {
    try {
      await clearCredentials()
      dispatch(clearUserDetails())
      dispatch(setNotification({
        level: 'info',
        message: 'You have signed out'
      }))
    } catch (err) {
      dispatch(setNotification({
        level: 'error',
        message: 'There was an error signing out'
      }))
    }
  }
}

export function initiateAuthorization () {
  return async dispatch => {
    try {
      await authorize()
      dispatch(loadUserDetails())
      dispatch(setNotification({
        level: 'info',
        message: 'You have signed in'
      }))
    } catch (err) {
      dispatch(setNotification({
        level: 'error',
        message: 'There was an error signing in'
      }))
    }
  }
}
