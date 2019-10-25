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
})
