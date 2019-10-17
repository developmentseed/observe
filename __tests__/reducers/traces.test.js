/* global describe, it, expect */

import reducer from '../../app/reducers/traces'

const initialState = {
  currentTrace: null,
  watcher: null,
  traces: []
}

const getMockCurrentTrace = function () {
  return {
    points: [{
      longitude: 1.0,
      latitude: 2.0,
      timestamp: 100
    }, {
      longitude: 2.0,
      latitude: 3.0,
      timestamp: 200
    }],
    paused: false
  }
}

describe('test for traces reducer', () => {
  it('should handle STARTED_TRACE action correctly', () => {
    const action = {
      type: 'STARTED_TRACE'
    }
    const newState = reducer(initialState, action)
    expect(newState).toEqual({
      watcher: null,
      currentTrace: {
        points: []
      },
      traces: []
    })
  })
  it('should handle TRACE_POINT_CAPTURED correctly', () => {
    const state = {
      ...initialState,
      currentTrace: {
        points: []
      }
    }
    const action1 = {
      type: 'TRACE_POINT_CAPTURED',
      location: {
        coords: {
          longitude: 1.0,
          latitude: 2.0,
          timestamp: 100
        }
      }
    }
    const statePoint1 = reducer(state, action1)
    expect(statePoint1.currentTrace).toEqual({
      points: [{
        longitude: 1.0,
        latitude: 2.0,
        timestamp: 100
      }]
    })
    const action2 = {
      type: 'TRACE_POINT_CAPTURED',
      location: {
        coords: {
          longitude: 2.0,
          latitude: 3.0,
          timestamp: 200
        }
      }
    }

    // test adding second point
    const statePoint2 = reducer(statePoint1, action2)
    expect(statePoint2.currentTrace).toEqual({
      points: [{
        longitude: 1.0,
        latitude: 2.0,
        timestamp: 100
      }, {
        longitude: 2.0,
        latitude: 3.0,
        timestamp: 200
      }]
    })
  })

  it('tests that PAUSED_TRACE marks currentTrace as paused', () => {
    const mockCurrentTrace = getMockCurrentTrace()
    const state = {
      ...initialState,
      currentTrace: mockCurrentTrace,
      watcher: {}
    }
    const action = {
      type: 'PAUSED_TRACE'
    }
    const newState = reducer(state, action)
    expect(newState.currentTrace.paused).toEqual(true)
  })

  it('tests that UNPAUSED_TRACE marks currentTrace as paused', () => {
    const mockCurrentTrace = getMockCurrentTrace()
    const state = {
      ...initialState,
      currentTrace: mockCurrentTrace,
      watcher: {}
    }
    const action = {
      type: 'UNPAUSED_TRACE'
    }
    const newState = reducer(state, action)
    expect(newState.currentTrace.paused).toEqual(false)
  })

  it('tests that ENDED_TRACE correctly ends a trace', () => {
    const mockCurrentTrace = getMockCurrentTrace()
    const state = {
      ...initialState,
      currentTrace: mockCurrentTrace,
      watcher: {}
    }
    const action = {
      type: 'ENDED_TRACE'
    }
    const newState = reducer(state, action)
    expect(newState).toEqual({
      currentTrace: null,
      watcher: null,
      traces: [
        {
          id: 'observe-hauptbanhof',
          pending: true,
          points: mockCurrentTrace.points
        }
      ]
    })
  })
})
