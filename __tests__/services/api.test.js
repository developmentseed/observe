/* global fetch */
/* global test */
/* global __dirname */
/* global expect */

import { getDataForBbox, getFeature } from '../../app/services/api'
import path from 'path'
import fs from 'fs'

import { addIconUrl } from '../../app/utils/add-icon-url'
import { filterTags } from '../../app/utils/filter-tags'

test('fetch data for bbox', async () => {
  const xmlData = fs.readFileSync(path.join(__dirname, '../fixtures/osm-xml-for-bbox.xml'), 'utf-8')
  fetch.mockResponseOnce(xmlData)
  const geojson = addIconUrl(filterTags(await getDataForBbox([[-1, 1], [-1, 1]])))
  expect(fetch.mock.calls[0][0]).toEqual('http://example.com/api/0.6/map/?bbox=-1,1,-1,1')
  expect(geojson).toMatchSnapshot()
})

test('filter relations out of the xml data', async () => {
  const xmlData = fs.readFileSync(path.join(__dirname, '../fixtures/osm-xml-with-relations.xml'), 'utf-8')
  fetch.mockResponseOnce(xmlData)
  const geojson = addIconUrl(filterTags(await getDataForBbox([[-1, 1], [-1, 1]])))
  expect(geojson).toMatchSnapshot()
})

test('fetch feature from the api', async () => {
  const xmlData = fs.readFileSync(path.join(__dirname, '../fixtures/osm-node.xml'), 'utf-8')
  fetch.mockResponseOnce(xmlData)
  const data = await getFeature('node', 4317433537)
  expect(data).toMatchSnapshot()
})
