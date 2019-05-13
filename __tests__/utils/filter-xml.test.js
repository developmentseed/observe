/* global fetch */
/* global test */
/* global __dirname */
/* global expect */

import fs from 'fs'
import path from 'path'
import { filterRelations } from '../../app/utils/filter-xml'
import DOMParser from 'xmldom'

test('filter relations from xml', () => {
  const xml = fs.readFileSync(path.join(__dirname, '../fixtures/osm-xml-with-relations.xml'), { 'encoding': 'utf-8' })
  const xmlDom = new DOMParser.DOMParser().parseFromString(xml, 'text/xml')
  const xmlWithoutRelations = filterRelations(xmlDom)
  expect(xmlWithoutRelations).toMatchSnapshot()
})
