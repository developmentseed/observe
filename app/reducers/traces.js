import * as types from '../actions/actionTypes'
import {
  getNewTrace,
  getPoint
} from '../utils/traces'

import getRandomId from '../utils/get-random-id'
import _cloneDeep from 'lodash.clonedeep'
import _findIndex from 'lodash.findindex'

const initialState = {
  currentTrace: null,
  watcher: null,
  paused: false,
  saving: false,
  traces: [],
  deletedTraceIds: []
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.TRACE_START: {
      const newTrace = getNewTrace()
      return {
        ...state,
        currentTrace: newTrace,
        paused: false
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
        apiId: null,
        status: 'pending',
        errors: [],
        geojson: {
          ...state.currentTrace,
          properties: {
            ...state.currentTrace.properties,
            id: traceId,
            description: action.description
          }
        }
      }

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

    case types.TRACE_STOP_SAVING: {
      return {
        ...state,
        saving: false
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

    case types.TRACE_UPLOAD_STARTED: {
      const traces = _cloneDeep(state.traces)
      const index = _findIndex(state.traces, t => t.id === action.id)
      traces[index].status = 'uploading'
      return {
        ...state,
        traces
      }
    }

    case types.TRACE_UPLOADED: {
      const traces = _cloneDeep(state.traces)
      const index = _findIndex(state.traces, t => t.id === action.oldId)
      traces[index].status = 'uploaded'
      traces[index].apiId = action.newId
      traces[index].geojson.properties.id = action.newId
      return {
        ...state,
        traces
      }
    }

    case types.TRACE_UPLOAD_FAILED: {
      const traces = _cloneDeep(state.traces)
      const index = _findIndex(state.traces, t => t.id === action.id)
      traces[index].status = 'pending'
      traces[index].errors.push(action.error)
      return {
        ...state,
        traces
      }
    }

    case types.EDIT_TRACE: {
      let editedTrace = { ...action.trace }
      let traces = _cloneDeep(state.traces)
      traces = traces.filter(trace => trace.id !== action.trace.id)
      editedTrace.geojson.properties.description = action.description
      traces.push(editedTrace)
      return {
        ...state,
        traces
      }
    }

    case types.DELETE_TRACE: {
      let traces = _cloneDeep(state.traces)
      traces = traces.filter(trace => trace.id !== action.trace.id)
      if (action.trace.apiId) {
        let deletedTraceIds = state.deletedTraceIds
        deletedTraceIds.push(action.trace.apiId)
        return {
          ...state,
          traces,
          deletedTraceIds
        }
      } else {
        return {
          ...state,
          traces
        }
      }
    }

    case types.DELETED_TRACE: {
      let deletedTraceIds = _cloneDeep(state.deletedTraceIds)
      deletedTraceIds.filter(id => id !== action.traceId)
      return {
        ...state,
        deletedTraceIds
      }
    }

    case types.CLEAR_UPLOADED_TRACES: {
      let traces = _cloneDeep(state.traces)
      traces = traces.filter(trace => trace.status !== 'uploaded')
      return {
        ...state,
        traces
      }
    }
  }
  return state
}
