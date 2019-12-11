import * as types from './actionTypes'
import traceService from '../services/trace'
import * as api from '../services/observe-api'

export function startTrace () {
  return (dispatch, getState) => {
    const currentTrace = getState().traces.currentTrace
    if (currentTrace) {
      console.error('startTrace called with trace already running')
      return
    }
    traceService.startTrace(dispatch)
  }
}

export function pauseTrace () {
  return {
    type: types.TRACE_PAUSE
  }
}

export function unpauseTrace () {
  return {
    type: types.TRACE_UNPAUSE
  }
}

export function endTrace (description = '') {
  return async (dispatch, getState) => {
    const { watcher, currentTrace } = getState().traces
    if (!currentTrace) {
      console.error('endTrace called with no current trace')
      return
    }
    traceService.endTrace(dispatch, watcher, description)
    await dispatch(uploadPendingTraces())
  }
}

export function uploadPendingTraces () {
  return async (dispatch, getState) => {
    const isConnected = getState().network.isConnected
    if (!isConnected) {
      return
    }
    const { traces } = getState().traces
    const pendingTraces = traces.filter(t => t.status === 'pending')
    for (let trace of pendingTraces) {
      dispatch(startUploadingTrace(trace.id))
      try {
        const newId = await api.uploadTrace(dispatch, trace)
        dispatch(uploadedTrace(trace.id, newId))
      } catch (e) {
        dispatch(uploadTraceFailed(trace.id, e))
      }
    }
  }
}

function startUploadingTrace (id) {
  return {
    type: types.TRACE_UPLOAD_STARTED,
    id
  }
}

function uploadedTrace (oldId, newId) {
  return {
    type: types.TRACE_UPLOADED,
    oldId,
    newId
  }
}

function uploadTraceFailed (id, error) {
  return {
    type: types.TRACE_UPLOAD_FAILED,
    id,
    error
  }
}

/**
 * Used to set a `saving` boolean on traces.
 * We need this to know to hide the RecordHeader on the saveTraces screen
 * // FIXME: ideally we would not need this as a separate action
 */
export function startSavingTrace () {
  return {
    type: types.TRACE_START_SAVING
  }
}

export function stopSavingTrace () {
  return {
    type: types.TRACE_STOP_SAVING
  }
}

export function discardTrace () {
  return (dispatch, getState) => {
    const { watcher } = getState().traces
    if (watcher) watcher.remove()
    dispatch({
      type: types.TRACE_DISCARD
    })
  }
}

export function editTrace (trace, description) {
  return {
    type: types.EDIT_TRACE,
    trace,
    description
  }
}

export function deletingTrace (id) {
  return {
    type: types.DELETING_TRACE,
    id
  }
}

export function deletePendingTraces () {
  return async (dispatch, getState) => {
    const { deletedTraceIds } = getState().traces
    if (!deletedTraceIds.length) return
    for (let traceId of deletedTraceIds) {
      dispatch(deletingTrace(traceId))
      try {
        await api.deleteTrace(dispatch, traceId)
        dispatch(deletedTrace(traceId))
      } catch (error) {
        console.log('delete trace failed', error)
        dispatch(deleteTraceFailed(traceId))
      }
    }
  }
}

export function deleteTrace (trace) {
  return (dispatch) => {
    dispatch({
      type: types.DELETE_TRACE,
      trace
    })

    dispatch(deletePendingTraces())
  }
}

export function deletedTrace (traceId) {
  return {
    type: types.DELETED_TRACE,
    traceId
  }
}

export function deleteTraceFailed (traceId) {
  return {
    type: types.DELETE_TRACE_FAILED,
    traceId
  }
}

export function clearUploadedTraces () {
  return {
    type: types.CLEAR_UPLOADED_TRACES
  }
}

export function uploadPendingEdits () {
  console.log('uploading pending traces...')
  return async (dispatch, getState) => {
    const { editedTraces } = getState().traces
    if (!editedTraces.length) return
    for (let trace of editedTraces) {
      try {
        await api.editTrace(dispatch, trace.apiId, trace.geojson.properties.description)
        dispatch({
          type: types.UPLOADED_PENDING_TRACE_EDIT,
          trace
        })
      } catch (error) {
        console.log('edit trace error', error)
        dispatch({
          type: types.UPLOAD_PENDING_TRACE_EDIT_FAILED,
          trace,
          error
        })
      }
    }
  }
}
