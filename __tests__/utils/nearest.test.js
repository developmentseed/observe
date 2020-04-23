/* global test */
/* global expect */
/* global __dirname */

import fs from 'fs'
import path from 'path'
import { findNearest } from '../../app/utils/nearest'

test('find nearest features for a node', () => {
  const features = JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures/osm-geojson.geojson'), { 'encoding': 'utf-8' }))

  // node close to a way / linestring
  const node1 = {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [77.6109, 12.9764]
    },
    'properties': {}
  }

  // node close to a way / polygon
  const node2 = {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [77.6029, 12.9681]
    },
    'properties': {}
  }

  const nearest1 = findNearest(node1, features)
  const nearest2 = findNearest(node2, features)
  expect(nearest1).toMatchSnapshot()
  expect(nearest2).toMatchSnapshot()
})
