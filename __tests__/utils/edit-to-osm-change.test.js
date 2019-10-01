/* global describe, it, expect */
import editToOsmChange from '../../app/utils/edit-to-osm-change'
import { getFeature } from '../test-utils'

describe('test function to convert edit JSON to osm-change XML for a single feature', () => {
  it('should create a simple create action', () => {
    const geom = {
      type: 'Point',
      coordinates: [
        -1, 1
      ]
    }
    const props = {
      version: 1,
      building: 'yes'
    }
    const edit = {
      type: 'create',
      oldFeature: null,
      newFeature: getFeature('node/-1', props, geom)
    }
    const changesetId = 123
    expect(editToOsmChange(edit, changesetId)).toMatchSnapshot()
  })

  it('should create a modify action', () => {
    const oldGeom = {
      type: 'Point',
      coordinates: [
        -1,
        1
      ]
    }
    const oldProps = {
      version: 1,
      building: 'yes'
    }
    const oldFeature = getFeature('node/1', oldProps, oldGeom)
    const newGeom = {
      type: 'Point',
      coordinates: [
        -2,
        2
      ]
    }
    const newProps = {
      version: 2,
      building: 'no'
    }
    const newFeature = getFeature('node/1', newProps, newGeom)
    const edit = {
      type: 'modify',
      oldFeature,
      newFeature
    }
    const changesetId = 123
    const xmlString = editToOsmChange(edit, changesetId)
    expect(xmlString).toMatchSnapshot()
  })

  it('should modify a way with tags correctly', () => {
    const oldGeom = {
      type: 'LineString',
      coordinates: [[0, 1], [0, 0], [1, 1]]
    }
    const oldProps = {
      highway: 'primary',
      name: 'foo',
      version: 2,
      ndrefs: [1, 4, 7]
    }

    const oldFeature = getFeature('way/1', oldProps, oldGeom)
    const newGeom = oldGeom
    const newProps = {
      highway: 'tertiary',
      name: 'bar',
      version: 3,
      ndrefs: [1, 4, 7]
    }
    const newFeature = getFeature('way/1', newProps, newGeom)
    const changesetId = 123
    const edit = {
      type: 'modify',
      oldFeature,
      newFeature
    }
    const xmlString = editToOsmChange(edit, changesetId)
    expect(xmlString).toMatchSnapshot()
  })

  it('should generate XML for delete actions correctly', () => {
    const feature = getFeature('node/1', { building: 'yes', version: 2 }, {
      type: 'Point',
      coordinates: [-1, 1]
    })
    const changesetId = 123
    const edit = {
      type: 'delete',
      oldFeature: feature,
      newFeature: null
    }
    const xmlString = editToOsmChange(edit, changesetId)
    expect(xmlString).toMatchSnapshot()
  })
})
