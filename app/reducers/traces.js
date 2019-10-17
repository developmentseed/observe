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
        paused: true
      }
    }

    case types.UNPAUSED_TRACE: {
      return {
        ...state,
        paused: false
      }
    }

    case types.TRACE_POINT_CAPTURED: {
      // if the current trace is paused, do nothing, don't add point.
      if (state.paused) {
        return state
      }
      return {
        ...state,
        currentTrace: getPoint(action.location, state.currentTrace)
      }
    }

    case types.ENDED_TRACE: {
      const traceId = getRandomId()
      const newTrace = {
        id: traceId,
        pending: true,
        geojson: {
          ...state.currentTrace,
          properties: {
            ...state.currentTrace.properties,
            id: traceId,
            description: action.description
          }
        }
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
        watcher: action.watcher
      }
    }
  }
  return state
}
