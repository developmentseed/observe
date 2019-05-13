/* global describe, expect, it */

import propertiesDiff from '../../app/utils/properties-diff'

describe('test properties diff', () => {
  it('should return a properties diff correctly', () => {
    const propsA = {
      'id': 'node/1',
      'version': 7,
      'building': 'yes',
      'addr:city': 'Seattle',
      'amenity': 'park'
    }
    const propsB = {
      'id': 'node/1',
      'version': 8,
      'building': 'residential',
      'addr:city': 'Seattle',
      'addr:state': 'WA'
    }
    const diff = propertiesDiff(propsA, propsB)
    expect(diff).toMatchSnapshot()
  })
})
