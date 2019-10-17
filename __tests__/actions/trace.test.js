/* global jest, it, expect, describe */

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
  startTrace,
  endTrace,
  pauseTrace,
  unpauseTrace
} from '../../app/actions/traces'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)

jest.mock('../../app/services/trace', () => {
  return {
    startTrace: dispatch => {
      dispatch({
        type: 'STARTED_TRACE'
      })
      dispatch({
        type: 'SET_TRACE_SUBSCRIPTION',
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
        type: 'ENDED_TRACE',
        description
      })
    }
  }
})

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

describe('test trace actions', () => {
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
    expect(actions[0].type).toEqual('ENDED_TRACE')
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
    expect(actions[0].type).toEqual('PAUSED_TRACE')
  })
  it('should unpause trace', () => {
    const store = mockStore({
      traces: {
        currentTrace: getMockCurrentTrace()
      }
    })
    store.dispatch(unpauseTrace())
    const actions = store.getActions()
    expect(actions[0].type).toEqual('UNPAUSED_TRACE')
  })
})
