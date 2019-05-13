/* global expect, describe, it */

import { ObserveError } from '../../app/utils/errors'

describe('test base error class behaves as expected', () => {
  it('should instantiate correctly', () => {
    const observeError = new ObserveError('TestError', 'test', 'extra data')
    expect(observeError.code).toEqual('TestError')
    expect(observeError.message).toEqual('test')
    expect(observeError.extra).toEqual('extra data')
    expect(observeError.retryable).toEqual(false)
  })

  it('should output toJSON correctly', () => {
    const observeError = new ObserveError('TestError', 'test', 'extra data')
    expect(observeError.toJSON()).toEqual({
      code: 'TestError',
      message: 'test',
      extra: 'extra data',
      retryable: false
    })
  })

  it('should serialize an Error class passed as extra correctly', () => {
    const err = new Error('test error')
    const observeError = new ObserveError('TestError', 'test', err)
    const errorJSON = observeError.toJSON()
    expect(errorJSON.extra.message).toEqual('test error')
    expect(errorJSON.extra.name).toEqual('Error')
    expect(typeof errorJSON.extra.stack).toEqual('string')
  })
})
