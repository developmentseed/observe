import * as types from '../actions/actionTypes'
import {
  getNewTrace,
  getPoint
} from '../utils/traces'

const initialState = {
  currentTrace: null,
  watcher: null,
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
    case types.TRACE_POINT_CAPTURED: {
      const point = getPoint(action.data)
      return {
        ...state,
        currentTrace: {
          points: [...state.currentTrace.points, point]
        }
      }
    }
    case types.ENDED_TRACE: {
      const newTrace = {
        points: currentTrace.points,
        id: 'foo', // FIXME: generate random id
        pending: true
      }
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
}