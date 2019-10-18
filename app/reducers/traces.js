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
  saving: false,
  traces: []
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.TRACE_START: {
      const newTrace = getNewTrace()
      return {
        ...state,
        currentTrace: newTrace
      }
    }
    case types.TRACE_PAUSE: {
      return {
        ...state,
        paused: true
      }
    }

    case types.TRACE_UNPAUSE: {
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

    case types.TRACE_END: {
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
        saving: false,
        traces: [...state.traces, newTrace]
      }
    }

    case types.TRACE_START_SAVING: {
      return {
        ...state,
        saving: true,
        paused: true
      }
    }

    case types.TRACE_DISCARD: {
      return {
        ...state,
        currentTrace: null,
        watcher: null,
        saving: false,
        paused: false
      }
    }

    case types.TRACE_SET_SUBSCRIPTION: {
      return {
        ...state,
        watcher: action.watcher
      }
    }
  }
  return state
}
