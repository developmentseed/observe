import * as types from '../actions/actionTypes'

const initialState = {
  notification: null
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.SET_NOTIFICATION:
      return {
        notification: {
          message: action.message,
          level: action.level
        }
      }
    case types.UNSET_NOTIFICATION:
      return {
        notification: null
      }
  }

  return state
}
