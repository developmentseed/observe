/* global fetch */
/* global test */
/* global __dirname */
/* global expect */

import { getDataForBbox, getFeature, createChangeset, getMemberNodes, saveDataForTile } from '../../app/services/api'
import path from 'path'
import fs from 'fs'

import { addIconUrl } from '../../app/utils/add-icon-url'
import { filterTags } from '../../app/utils/filter-tags'
import getChangesetXML from '../../app/utils/get-changeset-xml'

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

test('create a changeset', async () => {
  const changesetTags = {
    created_by: `Observe-Test`,
    comment: 'Test Changeset'
  }
  const changesetXML = getChangesetXML(changesetTags)
  fetch.mockResponseOnce('1')
  let changesetId = await createChangeset(changesetXML)
  expect(changesetId).toBe('1')
})

test('fetch all member nodes of a feature', async () => {
  const wayData = fs.readFileSync(path.join(__dirname, '../fixtures/way-343446026/way-343446026.xml'), 'utf-8')
  const node1 = fs.readFileSync(path.join(__dirname, '../fixtures/way-343446026/node-3502789251.xml'), 'utf-8')
  const node2 = fs.readFileSync(path.join(__dirname, '../fixtures/way-343446026/node-3502789252.xml'), 'utf-8')
  const node3 = fs.readFileSync(path.join(__dirname, '../fixtures/way-343446026/node-3502789253.xml'), 'utf-8')
  const node4 = fs.readFileSync(path.join(__dirname, '../fixtures/way-343446026/node-3502789254.xml'), 'utf-8')

  fetch.resetMocks()
  fetch
    .once(wayData, { status: 200 })
    .once(node1)
    .once(node2)
    .once(node3)
    .once(node4)
    .once(node1)

  const memberNodes = await getMemberNodes(343446026, 1)
  expect(memberNodes).toMatchSnapshot()
})

test('fetching member nodes of a feature with different version upstream should throw', async () => {
  const wayData = fs.readFileSync(path.join(__dirname, '../fixtures/way-343446026/way-343446026.xml'), 'utf-8')

  fetch.resetMocks()
  fetch
    .once(wayData, { status: 200 })

  expect(() => {
    getMemberNodes(343446026, 2).toThrow('The feature has a different version upstream')
  })
})

test('save data for tile', async () => {
  const xmlData = fs.readFileSync(path.join(__dirname, '../fixtures/osm-xml-for-quadkey.xml'), 'utf-8')
  fetch.resetMocks()
  fetch.once(xmlData, { status: 200 })

  saveDataForTile('0320100322313221')
    .then(d => {
      expect(d).toBe(7000)
    })
})
