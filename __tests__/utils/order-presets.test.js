/* global test */
/* global expect */

import orderPresets from '../../app/utils/order-presets'

const presetFixture = [{ 'value': 'IBD', 'key': 'short_name:eo' }, { 'value': '12', 'key': 'building:levels' }, { 'key': 'website', 'type': 'url', 'icon': 'website', 'placeholder': 'https://example.com', 'label': 'Website', 'value': 'https://www.iadb.org/' }, { 'value': 'New York Avenue Northwest', 'key': 'addr:street' }, { 'key': 'office', 'type': 'typeCombo', 'label': 'Type', 'value': 'government' }, { 'key': 'source', 'type': 'semiCombo', 'icon': 'source', 'universal': true, 'label': 'Sources', 'snake_case': false, 'caseSensitive': true, 'options': ['survey', 'local knowledge', 'gps', 'aerial imagery', 'streetlevel imagery'], 'value': 'dcgis' }, { 'key': 'name', 'type': 'localized', 'label': 'Name', 'universal': true, 'placeholder': 'Common name (if any)', 'value': 'Inter-American Development Bank' }, { 'key': 'building', 'type': 'combo', 'label': 'Building', 'value': 'office' }, { 'value': '1300', 'key': 'addr:housenumber' }]

const orderedPresetFixture = [{ 'key': 'name', 'type': 'localized', 'label': 'Name', 'universal': true, 'placeholder': 'Common name (if any)', 'value': 'Inter-American Development Bank' }, { 'key': 'website', 'type': 'url', 'icon': 'website', 'placeholder': 'https://example.com', 'label': 'Website', 'value': 'https://www.iadb.org/' }, { 'key': 'office', 'type': 'typeCombo', 'label': 'Type', 'value': 'government' }, { 'key': 'source', 'type': 'semiCombo', 'icon': 'source', 'universal': true, 'label': 'Sources', 'snake_case': false, 'caseSensitive': true, 'options': ['survey', 'local knowledge', 'gps', 'aerial imagery', 'streetlevel imagery'], 'value': 'dcgis' }, { 'key': 'building', 'type': 'combo', 'label': 'Building', 'value': 'office' }, { 'value': 'IBD', 'key': 'short_name:eo' }, { 'value': '12', 'key': 'building:levels' }, { 'value': 'New York Avenue Northwest', 'key': 'addr:street' }, { 'value': '1300', 'key': 'addr:housenumber' }]

test('preset ordering', () => {
  const orderedPresets = orderPresets(presetFixture)
  expect(orderedPresets).toEqual(orderedPresetFixture)
})
