import traceService from '../services/trace'

export function startTrace () {
  console.log('called start trace')
  return (dispatch, getState) => {
    console.log('dispatch start trace')
    const currentTrace = getState().traces.currentTrace
    if (currentTrace) {
      console.error('startTrace called with trace already running')
      return
    }
    traceService.startTrace(dispatch)
  }
}

export function endTrace () {
  console.log('called end trace')
  return (dispatch, getState) => {
    console.log('dispatched end trace')
    const { watcher, currentTrace } = getState().traces
    if (!currentTrace) {
      console.error('endTrace called with no current trace')
      return
    }
    traceService.endTrace(dispatch, watcher)
  }
}
