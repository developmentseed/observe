/* global describe, it, expect */
import getChangesetXML from '../../app/utils/get-changeset-xml'

describe('test changeset xml generation', () => {
  it('should return expected changeset xml for key-value pairs', () => {
    const xml = getChangesetXML({
      source: 'Observe',
      comment: 'test comment'
    })
    expect(xml).toMatchSnapshot()
  })
})
