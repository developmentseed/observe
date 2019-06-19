/* global fetch */
/* global test */
/* global __dirname */
/* global expect */

import getPresetByTags from '../../app/utils/get-preset-by-tags'

test('get preset by tags', () => {
  const preset = getPresetByTags({ building: '*' })
  expect(preset).toMatchSnapshot()
})
