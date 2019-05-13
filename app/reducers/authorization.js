import * as types from '../actions/actionTypes'

const DEFAULT_STATE = {
  isAuthorized: false
}

export default function (state = DEFAULT_STATE, action) {
  switch (action.type) {
    case types.CLEAR_USER_DETAILS: {
      return {
        ...state,
        isAuthorized: false
      }
    }

    case types.SET_AUTHORIZED: {
      const { isAuthorized } = action

      return {
        ...state,
        isAuthorized
      }
    }
  }

  return state
}
