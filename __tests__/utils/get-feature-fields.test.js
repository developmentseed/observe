/* global fetch */
/* global test */
/* global __dirname */
/* global expect */

import getFeatureFields from '../../app/utils/get-feature-fields'
import { getFeature } from '../test-utils'

test('get fields of a feature', () => {
  const featureWithFields = getFeature({ 'properties': {
    'id': 'node/observe-vfxnxtmo20j',
    'version': 1,
    'name': 'Test',
    'building': 'house',
    'icon': 'maki_marker'
  } })
  const featureWithoutFields = getFeature()

  expect(getFeatureFields(featureWithFields)).toMatchSnapshot()
  expect(getFeatureFields(featureWithoutFields)).toMatchSnapshot()
})
