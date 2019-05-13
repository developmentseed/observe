/* global fetch */
/* global test */
/* global __dirname */
/* global expect */

import fs from 'fs'
import path from 'path'
import { filterTags } from '../../app/utils/filter-tags'

test('filter tags from geojson', () => {
  const geojson = JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures/osm-geojson.geojson')))
  const filteredGeojson = filterTags(geojson)
  expect(filteredGeojson).toMatchSnapshot()
})
