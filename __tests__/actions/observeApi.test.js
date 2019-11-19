/* global it, expect, describe, jest */

import {
  setObserveAPIToken,
  logoutUser,
  getProfile
} from '../../app/actions/observeApi'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

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

  it('should emit OBSERVE_API_LOGOUT action correctly', () => {
    const store = mockStore({
      observeApi: {
        token: 'abcd'
      }
    })
    store.dispatch(logoutUser())
    const actions = store.getActions()
    expect(actions[0]).toEqual({
      type: 'OBSERVE_API_LOGOUT'
    })
  })

  it('should handle a 401 authentication error and reset the token', async () => {
    const store = mockStore({
      observeApi: {
        token: 'abcd'
      }
    })
    fetch.resetMocks()
    fetch.once(JSON.stringify({ 'message': 'Invalid Authentication' }), { status: 401 })
    await store.dispatch(getProfile())
    const actions = store.getActions()
    expect(actions[0]).toEqual({
      type: 'OBSERVE_API_LOGOUT'
    })
  })
})
