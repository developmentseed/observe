import * as types from './actionTypes'
import traceService from '../services/trace'

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
    type: types.PAUSED_TRACE
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
