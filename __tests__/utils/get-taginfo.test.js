/* global fetch */
/* global test */
/* global __dirname */
/* global expect */

import getTaginfo from '../../app/utils/get-taginfo'
import { getFeature } from '../test-utils'

test('get taginfo', () => {
  const mockFeature = getFeature('node/1', {
    'building': 'house',
    'icon': 'maki_marker',
    'id': 'node/1',
    'name': 'Test',
    'version': 1
  })

  const info = getTaginfo(mockFeature)
  expect(info).toBe('House')
})
