/* global describe, it, expect */

import reducer from '../../app/reducers/traces'

const initialState = {
  currentTrace: null,
  watcher: null,
  traces: [],
  paused: false
}

const getMockCurrentTrace = function () {
  return {
    type: 'Feature',
    properties: {
      timestamps: [100, 200],
      accuracies: [10, 20]
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [1.0, 1.0],
        [2.0, 2.0]
      ]
    }
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
        type: 'Feature',
        properties: {
          timestamps: [],
          accuracies: []
        },
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      },
      traces: [],
      paused: false
    })
  })

  it('should handle TRACE_POINT_CAPTURED correctly', () => {
    const state = {
      ...initialState,
      currentTrace: {
        type: 'Feature',
        properties: {
          timestamps: [],
          accuracies: []
        },
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      }
    }
    const action1 = {
      type: 'TRACE_POINT_CAPTURED',
      location: {
        coords: {
          longitude: 1.0,
          latitude: 2.0,
          timestamp: 100,
          accuracy: 10
        }
      }
    }
    const statePoint1 = reducer(state, action1)
    expect(statePoint1.currentTrace).toEqual({
      type: 'Feature',
      properties: {
        timestamps: [100],
        accuracies: [10]
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [1.0, 2.0]
        ]
      }
    })
    const action2 = {
      type: 'TRACE_POINT_CAPTURED',
      location: {
        coords: {
          longitude: 2.0,
          latitude: 3.0,
          timestamp: 200,
          accuracy: 20
        }
      }
    }

    // test adding second point
    const statePoint2 = reducer(statePoint1, action2)
    expect(statePoint2.currentTrace).toEqual({
      type: 'Feature',
      properties: {
        timestamps: [
          100,
          200
        ],
        accuracies: [
          10,
          20
        ]
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [1.0, 2.0],
          [2.0, 3.0]
        ]
      }
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
    expect(newState.paused).toEqual(true)
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
    expect(newState.paused).toEqual(false)
  })

  it('tests that ENDED_TRACE correctly ends a trace', () => {
    const mockCurrentTrace = getMockCurrentTrace()
    const state = {
      ...initialState,
      currentTrace: mockCurrentTrace,
      watcher: {}
    }
    const action = {
      type: 'ENDED_TRACE',
      description: 'test description'
    }
    const newState = reducer(state, action)
    const expectedTraceGeoJSON = {
      ...mockCurrentTrace,
      properties: {
        ...mockCurrentTrace.properties,
        id: 'observe-hauptbanhof',
        description: 'test description'
      }
    }
    expect(newState).toEqual({
      currentTrace: null,
      watcher: null,
      paused: false,
      traces: [
        {
          id: 'observe-hauptbanhof',
          pending: true,
          geojson: expectedTraceGeoJSON
        }
      ]
    })
  })
})
