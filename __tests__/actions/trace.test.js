/* global jest, it, expect, describe, fetch */

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
  startTrace,
  endTrace,
  pauseTrace,
  unpauseTrace,
  startSavingTrace,
  discardTrace,
  uploadPendingTraces
} from '../../app/actions/traces'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)

jest.mock('../../app/services/trace', () => {
  return {
    startTrace: dispatch => {
      dispatch({
        type: 'TRACE_START'
      })
      dispatch({
        type: 'TRACE_SET_SUBSCRIPTION',
        data: {
          remove: jest.fn()
        }
      })
      for (var i = 0; i < 4; i++) {
        dispatch({
          type: 'TRACE_POINT_CAPTURED',
          data: {
            longitude: i,
            latitude: i,
            timestamp: i
          }
        })
      }
    },
    endTrace: (dispatch, watcher, description) => {
      dispatch({
        type: 'TRACE_END',
        description
      })
    }
  }
})

// This is required because the observe API service calls the store directly
// to get the token.
jest.mock('../../app/utils/store', () => {
  return {
    store: {
      getState: () => {
        return {
          observeApi: {
            token: 'abcd'
          }
        }
      }
    }
  }
})

const getMockCurrentTrace = function () {
  return {
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

/**
 *
 * @param {Number} m - used to construct id, timestamps, coords
 */
const getMockTrace = function (m) {
  return {
    id: `id-${m}`,
    pending: true,
    uploading: false,
    geojson: {
      type: 'Feature',
      properties: {
        timestamps: [
          m,
          m + 10,
          m + 20
        ]
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [m, m],
          [m + 1, m - 1],
          [m + 2, m - 2]
        ]
      }
    }
  }
}

const getMockTracePostResponse = function (m, id) {
  return {
    type: 'Feature',
    properties: {
      id,
      timestamps: [
        m,
        m + 10,
        m + 20
      ]
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [m, m],
        [m + 1, m - 1],
        [m + 2, m - 2]
      ]
    }
  }
}

describe('test trace sync actions', () => {
  it('should start trace correctly', () => {
    const store = mockStore({
      traces: {
        currentTrace: null
      }
    })
    store.dispatch(startTrace())
    const actions = store.getActions()
    expect(actions.length).toEqual(6)
    expect(actions).toMatchSnapshot()
  })

  it('should end trace correctly', () => {
    const store = mockStore({
      traces: {
        currentTrace: getMockCurrentTrace()
      }
    })
    store.dispatch(endTrace('test description'))
    const actions = store.getActions()
    expect(actions.length).toEqual(1)
    expect(actions[0].type).toEqual('TRACE_END')
    expect(actions[0].description).toEqual('test description')
  })
  it('should pause trace', () => {
    const store = mockStore({
      traces: {
        currentTrace: getMockCurrentTrace()
      }
    })
    store.dispatch(pauseTrace())
    const actions = store.getActions()
    expect(actions[0].type).toEqual('TRACE_PAUSE')
  })
  it('should unpause trace', () => {
    const store = mockStore({
      traces: {
        currentTrace: getMockCurrentTrace()
      }
    })
    store.dispatch(unpauseTrace())
    const actions = store.getActions()
    expect(actions[0].type).toEqual('TRACE_UNPAUSE')
  })
  it('should start saving trace', () => {
    const store = mockStore({})
    store.dispatch(startSavingTrace())
    const actions = store.getActions()
    expect(actions[0].type).toEqual('TRACE_START_SAVING')
  })
  it('should discard trace', () => {
    const store = mockStore({
      traces: {
        watcher: {
          remove: jest.fn()
        }
      }
    })
    store.dispatch(discardTrace())
    const actions = store.getActions()
    expect(actions[0].type).toEqual('TRACE_DISCARD')
  })
})

describe('trace upload / async actions', () => {
  it('should upload a single trace', async () => {
    const store = mockStore({
      traces: {
        traces: [
          getMockTrace(1)
        ]
      }
    })
    fetch.resetMocks()
    fetch.once(JSON.stringify(getMockTracePostResponse(1, 'fakeid')))
    await store.dispatch(uploadPendingTraces())
    const actions = store.getActions()
    expect(actions).toMatchSnapshot()
    expect(fetch.mock.calls).toMatchSnapshot()
  })

  it('should upload multiple pending traces', async () => {
    const store = mockStore({
      traces: {
        traces: [
          getMockTrace(1),
          getMockTrace(2)
        ]
      }
    })
    fetch.resetMocks()
    fetch.once(JSON.stringify(getMockTracePostResponse(1, 'fakeid-1')))
      .once(JSON.stringify(getMockTracePostResponse(2, 'fakeid-2')))
    await store.dispatch(uploadPendingTraces())
    const actions = store.getActions()
    expect(actions).toMatchSnapshot()
    expect(fetch.mock.calls).toMatchSnapshot()
  })

  it('should not upload non-pending traces', async () => {
    const trace1 = getMockTrace(1)
    const trace2 = getMockTrace(2)
    trace2.pending = false
    const store = mockStore({
      traces: {
        traces: [
          trace1,
          trace2
        ]
      }
    })
    fetch.resetMocks()
    fetch.once(JSON.stringify(getMockTracePostResponse(1, 'fakeid-1')))
    await store.dispatch(uploadPendingTraces())
    const actions = store.getActions()
    expect(actions).toMatchSnapshot()
    expect(fetch.mock.calls).toMatchSnapshot()
  })

  it('should not upload uploading traces', async () => {
    const trace1 = getMockTrace(1)
    trace1.uploading = true
    const trace2 = getMockTrace(2)
    const store = mockStore({
      traces: {
        traces: [
          trace1,
          trace2
        ]
      }
    })
    fetch.resetMocks()
    fetch.once(JSON.stringify(getMockTracePostResponse(2, 'fakeid-2')))
    await store.dispatch(uploadPendingTraces())
    const actions = store.getActions()
    expect(actions).toMatchSnapshot()
    expect(fetch.mock.calls).toMatchSnapshot()
  })
})
