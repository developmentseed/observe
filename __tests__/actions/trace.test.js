/* global jest, it, expect, describe */

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
  startTrace,
  endTrace
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
    endTrace: (dispatch, watcher) => {
      dispatch({
        type: 'ENDED_TRACE'
      })
    }
  }
})

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
        currentTrace: {
          points: [[0, 0], [1, 1]]
        }
      }
    })
    store.dispatch(endTrace())
    const actions = store.getActions()
    expect(actions.length).toEqual(1)
    expect(actions[0].type).toEqual('ENDED_TRACE')
  })
})
