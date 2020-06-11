/* global test */
/* global expect */
/* global __dirname */

import fs from 'fs'
import path from 'path'
import { findNearestPoint, findNearest } from '../../app/utils/nearest'
import { addNodes } from '../../app/services/nodecache'

test('find nearest features for a node', async () => {
  const features = JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures/osm-geojson-dc.geojson'), { 'encoding': 'utf-8' }))

  const nodes = JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures/dc-nodes.json'), { 'encoding': 'utf-8' }))
  const tile = '0320100322313212'
  await addNodes(tile, nodes)

  // node close to a polygon
  const node1 = {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [-77.0244, 38.9023]
    },
    'properties': {}
  }

  // node away from a linestring
  const node2 = {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [-77.0245, 38.9025]
    },
    'properties': {}
  }

  const nearest1 = await findNearest(node1, features)
  const nearest2 = await findNearest(node2, features)

  expect(nearest1).toMatchSnapshot()
  expect(nearest2).toMatchSnapshot()

  const edge = nearest1.nearestEdge
  const snappedPoint = findNearestPoint(node1, edge)
  expect(snappedPoint).toMatchSnapshot()
})
