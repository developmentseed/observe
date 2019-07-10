/* global fetch */
/* global test */
/* global __dirname */
/* global expect */

import getFields from '../../app/utils/get-fields'

test('get fields for all field keys', () => {
  const treeFieldKeys = ['leaf_type_singular', 'leaf_cycle_singular', 'denotation']
  const pointFieldKeys = ['name']

  expect(getFields(treeFieldKeys)).toMatchSnapshot()
  expect(getFields(pointFieldKeys)).toMatchSnapshot()
})
