/* global describe, it, expect */

import reducer from '../../app/reducers/traces'
import { getMockTrace } from '../test-utils'
import { ObserveAPIError } from '../../app/utils/errors'

const initialState = {
  currentTrace: null,
  watcher: null,
  traces: [],
  paused: false,
  saving: false
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
  it('should handle TRACE_START action correctly', () => {
    const action = {
      type: 'TRACE_START'
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
      paused: false,
      saving: false
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
        timestamp: 100,
        coords: {
          longitude: 1.0,
          latitude: 2.0,
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
        timestamp: 200,
        coords: {
          longitude: 2.0,
          latitude: 3.0,
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

  it('tests that TRACE_PAUSE marks traces as paused', () => {
    const mockCurrentTrace = getMockCurrentTrace()
    const state = {
      ...initialState,
      currentTrace: mockCurrentTrace,
      watcher: {}
    }
    const action = {
      type: 'TRACE_PAUSE'
    }
    const newState = reducer(state, action)
    expect(newState.paused).toEqual(true)
  })

  it('tests that TRACE_UNPAUSE marks traces as unpaused', () => {
    const mockCurrentTrace = getMockCurrentTrace()
    const state = {
      ...initialState,
      currentTrace: mockCurrentTrace,
      watcher: {}
    }
    const action = {
      type: 'TRACE_UNPAUSE'
    }
    const newState = reducer(state, action)
    expect(newState.paused).toEqual(false)
  })

  it('tests that TRACE_END correctly ends a trace', () => {
    const mockCurrentTrace = getMockCurrentTrace()
    const state = {
      ...initialState,
      currentTrace: mockCurrentTrace,
      watcher: {}
    }
    const action = {
      type: 'TRACE_END',
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
      saving: false,
      traces: [
        {
          id: 'observe-hauptbanhof',
          status: 'pending',
          errors: [],
          geojson: expectedTraceGeoJSON
        }
      ]
    })
  })

  it('tests that TRACE_START_SAVING sets saving to true', () => {
    const state = {
      ...initialState
    }
    const action = {
      type: 'TRACE_START_SAVING'
    }
    const newState = reducer(state, action)
    expect(newState.saving).toEqual(true)
    expect(newState.paused).toEqual(true)
  })

  it('tests that TRACE_DISCARD correctly discards a trace', () => {
    const state = {
      ...initialState,
      currentState: getMockCurrentTrace(),
      paused: true,
      saving: true
    }
    const action = {
      type: 'TRACE_DISCARD'
    }
    const newState = reducer(state, action)
    expect(newState.currentTrace).toEqual(null)
    expect(newState.paused).toEqual(false)
    expect(newState.saving).toEqual(false)
  })
})

describe('tests for upload trace actions', () => {
  it('should handle TRACE_UPLOAD_STARTED action correctly', () => {
    const mockTrace1 = getMockTrace(1)
    const mockTrace2 = getMockTrace(2)
    const state = {
      ...initialState,
      traces: [
        mockTrace1,
        mockTrace2
      ]
    }
    const action = {
      type: 'TRACE_UPLOAD_STARTED',
      id: mockTrace1.id
    }
    const newState = reducer(state, action)
    expect(newState.traces[0].status).toEqual('uploading')
    expect(newState.traces[1].status).toEqual('pending')
  })

  it('should handle TRACE_UPLOADED action correctly', () => {
    const mockTrace1 = getMockTrace(1)
    mockTrace1.uploading = true
    const mockTrace2 = getMockTrace(2)
    const state = {
      ...initialState,
      traces: [
        mockTrace1,
        mockTrace2
      ]
    }
    const action = {
      type: 'TRACE_UPLOADED',
      oldId: mockTrace1.id,
      newId: 'fakeid'
    }
    const newState = reducer(state, action)
    expect(newState.traces[0].id).toEqual('id-1')
    expect(newState.traces[0].apiId).toEqual('fakeid')
    expect(newState.traces[0].status).toEqual('uploaded')
    expect(newState.traces[0].geojson.properties.id).toEqual('fakeid')
  })

  it('should handle TRACE_UPLOAD_FAILED action correctly', () => {
    const mockTrace1 = getMockTrace(1)
    mockTrace1.uploading = true
    const mockTrace2 = getMockTrace(2)
    const state = {
      ...initialState,
      traces: [
        mockTrace1,
        mockTrace2
      ]
    }
    const action = {
      type: 'TRACE_UPLOAD_FAILED',
      id: mockTrace1.id,
      error: new ObserveAPIError('fake', 404)
    }
    const newState = reducer(state, action)
    expect(newState.traces[0].errors.length).toEqual(1)
    expect(newState.traces[0].status).toEqual('pending')
    expect(newState.traces[0].errors[0].message).toEqual('fake')
    expect(newState.traces[0].errors[0].status).toEqual(404)
  })
})
