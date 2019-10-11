import * as types from './actionTypes'
import traceService from '../services/trace'

export function startTrace() {
  return (dispatch, getState) => {
    const currentTrace = getState().trace.currentTrace
    if (currentTrace) {
      console.error('startTrace called with trace already running')
      return
    }
    traceService.startTrace(dispatch)
  }
}

export function endTrace() {
  return (dispatch, getState) => {
    const currentTrace = getStart().trace.currentTrace
    if (!currentTrace) {
      console.error('endTrace called with no current trace')
      return
    }
    traceService.endTrace(dispatch, currentTrace)
  }
}