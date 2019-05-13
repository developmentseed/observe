/* global fetch */
/* global test */
/* global __dirname */
/* global expect */

import { getParentPreset } from '../../app/utils/get-parent-preset'

test('get parent preset', () => {
  const presetBank = { 'name': 'Agribank', 'icon': 'maki-bank', 'geometry': ['point', 'area'], 'tags': { 'amenity': 'bank', 'brand:wikidata': 'Q4693829' }, 'addTags': { 'amenity': 'bank', 'brand': 'Agribank', 'brand:wikidata': 'Q4693829', 'brand:wikipedia': 'en:AgriBank', 'name': 'Agribank' }, 'removeTags': { 'amenity': 'bank', 'brand': 'Agribank', 'brand:wikidata': 'Q4693829', 'brand:wikipedia': 'en:AgriBank', 'name': 'Agribank' }, 'matchScore': 2, 'suggestion': true, 'key': 'amenity/bank/Agribank' }

  const presetBuilding = { 'icon': 'maki-building', 'geometry': ['area'], 'tags': { 'building': 'apartments' }, 'matchScore': 0.5, 'name': 'Apartment Building', 'key': 'building/apartments' }
  const parentBankPreset = getParentPreset(presetBank)
  const parentBuildingPreset = getParentPreset(presetBuilding)
  expect(parentBankPreset).toMatchSnapshot()
  expect(parentBuildingPreset).toMatchSnapshot()
})
