/* global fetch */
/* global test */
/* global __dirname */
/* global expect */

import fs from 'fs'
import path from 'path'
import { addIconUrl } from '../../app/utils/add-icon-url'

test('icons are added to points alone', () => {
  const geojson = JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures/osm-geojson.geojson'), { 'encoding': 'utf-8' }))
  const geojsonWithIcons = addIconUrl(geojson)

  const points = geojsonWithIcons.features.filter(f => { return f.geometry.type === 'Point' })
  expect(points).toMatchSnapshot()

  const nonPoints = geojsonWithIcons.features.filter(f => { return f.geometry.type !== 'Point' })
  expect(nonPoints).toMatchSnapshot()
})
