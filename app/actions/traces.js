import * as types from './actionTypes'
import traceService from '../services/trace'
import { uploadTrace } from '../utils/traces'

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
  return (dispatch, getState) => {
    const { watcher, currentTrace } = getState().traces
    if (!currentTrace) {
      console.error('endTrace called with no current trace')
      return
    }
    traceService.endTrace(dispatch, watcher, description)
  }
}

export function uploadPendingTraces () {
  return async (dispatch, getState) => {
    const { traces } = getState().traces
    const pendingTraces = traces.filter(t => t.pending)
    for (let trace of pendingTraces) {
      dispatch(startUploadingTrace(trace))
      try {
        const id = await uploadTrace(trace)
        dispatch(uploadedTrace(trace, id))
      }
      catch (e) {
        dispatch(uploadTraceFailed(trace, e))
      }
    }
  }
}

function startUploadingTrace (trace) {
  return {
    type: types.TRACE_UPLOAD_STARTED,
    trace
  }
}

function uploadedTrace (trace, id) {
  return {
    type: types.TRACE_UPLOADED,
    trace,
    newId: id
  }
}

function uploadTraceFailed (trace, error) {
  return {
    type: types.TRACE_UPLOAD_FAILED,
    trace,
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
