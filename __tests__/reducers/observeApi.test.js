/* global describe, it, expect */

import reducer from '../../app/reducers/observeApi'

const initialState = {
  token: null
}

describe('test for observe api reducer', () => {
  it('should handle SET_OBSERVE_API_TOKEN', () => {
    const action = {
      type: 'SET_OBSERVE_API_TOKEN',
      token: 'abcd'
    }
    const newState = reducer(initialState, action)
    expect(newState).toEqual({
      token: 'abcd'
    })
  })

  it('should handle OBSERVE_API_LOGOUT', () => {
    const action = {
      type: 'OBSERVE_API_LOGOUT'
    }
    const state = {
      ...initialState,
      token: 'abcd'
    }
    const newState = reducer(state, action)
    expect(newState.token).toEqual(null)
  })
})
