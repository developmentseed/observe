import * as types from '../actions/actionTypes'

const initialState = {
  token: null
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.SET_OBSERVE_API_TOKEN: {
      return {
        ...state,
        token: action.token
      }
    }
  }
  return state
}
