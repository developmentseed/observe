import * as types from '../actions/actionTypes'
import {
  getNewTrace
} from '../utils/traces'

const initialState = {
  currentTrace: null,
  traces: []
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.STARTED_TRACE: {
      const newTrace = getNewTrace()
      return {
        ...state,
        currentTrace: newTrace
      } 
    }
  }
}