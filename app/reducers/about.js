import * as types from '../actions/actionTypes'

export default function (state = {}, action) {
  switch (action.type) {
    case types.LOADING_TEST:
      return {
        ...state,
        test: 'Loading'
      }

    case types.LOADED_TEST:
      return {
        ...state,
        test: 'Loaded'
      }
  }
  return state
}
