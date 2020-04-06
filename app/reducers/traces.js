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
  deletedTraceIds: [],
  editedTraces: []
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
      traces[index].uploadedAt = action.uploadedAt
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
      let editedTraces = _cloneDeep(state.editedTraces)
      traces = traces.filter(trace => trace.id !== action.trace.id)
      if (editedTrace.apiId && editedTrace.geojson.properties.description !== action.description) {
        editedTrace.status = 'pending edit'
        const index = _findIndex(editedTraces, t => t.id === editedTraces.id)
        if (index > -1) {
          editedTraces[index] = editedTrace
        } else {
          editedTraces.push(editedTrace)
        }
      }
      editedTrace.geojson.properties.description = action.description
      traces.push(editedTrace)
      return {
        ...state,
        traces,
        editedTraces
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
      deletedTraceIds = deletedTraceIds.filter(id => id !== action.traceId)
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

    case types.DELETE_TRACE_FAILED: {
      if (action.error.status === 404) {
        // this delete can't be retried so we remove the id from deletedTraceIds
        let deletedTraceIds = _cloneDeep(state.deletedTraceIds)
        deletedTraceIds = deletedTraceIds.filter(id => id !== action.traceId)
        return {
          ...state,
          deletedTraceIds
        }
      } else {
        break
      }
    }

    case types.UPLOADED_PENDING_TRACE_EDIT: {
      const traces = _cloneDeep(state.traces)
      const index = _findIndex(state.traces, t => t.id === action.trace.id)
      traces[index].status = 'uploaded'
      let editedTraces = _cloneDeep(state.editedTraces)
      editedTraces = editedTraces.filter(t => t.id === action.trace.id)
      return {
        ...state,
        editedTraces,
        traces
      }
    }

    case types.UPLOAD_PENDING_TRACE_EDIT_FAILED: {
      if (action.error.status === 404) {
        let editedTraces = _cloneDeep(state.editedTraces)
        editedTraces = editedTraces.filter(t => t.id === action.trace.id)
        return {
          ...state,
          editedTraces
        }
      } else {
        break
      }
    }
  }
  return state
}
