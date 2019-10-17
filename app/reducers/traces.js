import * as types from '../actions/actionTypes'
import {
  getNewTrace,
  getPoint
} from '../utils/traces'

import getRandomId from '../utils/get-random-id'

const initialState = {
  currentTrace: null,
  watcher: null,
  paused: false,
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
    case types.PAUSED_TRACE: {
      return {
        ...state,
        currentTrace: {
          ...state.currentTrace,
          paused: true
        }
      }
    }

    case types.TRACE_POINT_CAPTURED: {

      // if the current trace is paused, do nothing, don't add point.
      if (state.currentTrace.paused) {
        return state
      }
      const point = getPoint(action.location)
      return {
        ...state,
        currentTrace: {
          points: [...state.currentTrace.points, point]
        }
      }
    }
    case types.ENDED_TRACE: {
      const newTrace = {
        points: [...state.currentTrace.points],
        id: getRandomId(),
        description: action.description,
        pending: true
      }
      console.log('new trace', newTrace)
      return {
        ...state,
        currentTrace: null,
        watcher: null,
        traces: [...state.traces, newTrace]
      }
    }
    case types.SET_TRACE_SUBSCRIPTION: {
      return {
        ...state,
        watcher: action.data
      }
    }
  }
  return state
}
