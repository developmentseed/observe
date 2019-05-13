import * as types from '../actions/actionTypes'

const initialState = {
  userDetails: null,
  loadingDetails: false,
  notification: null
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.LOADED_USER_DETAILS:
      return {
        userDetails: action.details,
        loadingDetails: false,
        notification: {
          'message': 'Authentication successful',
          'type': 'info'
        }
      }

    case types.CLEAR_USER_DETAILS:
      return {
        userDetails: null
      }

    case types.LOADING_USER_DETAILS:
      return {
        loadingDetails: true
      }

    case types.ERROR_LOADING_USER_DETAILS:
      return {
        loadingDetails: false,
        notification: {
          'message': action.error.message,
          'type': 'error'
        }
      }
  }
  return state
}
