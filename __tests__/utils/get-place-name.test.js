/* global fetch */
/* global describe */
/* global it */
/* global __dirname */
/* global expect */

import fs from 'fs'
import path from 'path'
import { getPlaceName } from '../../app/utils/get-place-name'

describe('get correct place name', () => {
  it('get correct place name', () => {
    const openCageResponse = fs.readFileSync(path.join(__dirname, '../fixtures/opencage-response.json'), 'utf-8')

    fetch.resetMocks()
    fetch.once(openCageResponse)

    const testAoi = [-77.03000291418755, 38.89435682659166, -77.02899708581197, 38.89584316561448]

    return getPlaceName(testAoi)
      .then((name) => {
        expect(name).toBe('Penn Quarter, Washington')
      })
      .catch(err => {
        console.log(err)
      })
  })
})
