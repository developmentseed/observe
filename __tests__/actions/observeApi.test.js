/* global it, expect, describe */

import {
  setObserveAPIToken
} from '../../app/actions/observeApi'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('observe api actions', () => {
  it('should emit setObserveAPIToken action correctly', () => {
    const store = mockStore({
      observeApi: {
        token: null
      }
    })
    store.dispatch(setObserveAPIToken('abcd'))
    const actions = store.getActions()
    expect(actions[0]).toEqual({
      type: 'SET_OBSERVE_API_TOKEN',
      token: 'abcd'
    })
  })
})
