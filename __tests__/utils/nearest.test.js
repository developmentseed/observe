/* global test */
/* global expect */
/* global __dirname */

import fs from 'fs'
import path from 'path'
import { findNearest } from '../../app/utils/nearest'

test('find nearest features for a node', () => {
  const features = JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures/osm-geojson.geojson'), { 'encoding': 'utf-8' }))
  const node = {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [77.6109, 12.9764]
    },
    'properties': {}
  }

  const nearest = findNearest(node, features)
  expect(nearest).toMatchSnapshot()
})
