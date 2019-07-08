/* global fetch */
/* global describe */
/* global it */
/* global expect */
/* global console */
import { UploadNetworkError } from '../../app/utils/errors'
import { advanceTo } from 'jest-date-mock'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
  addFeature,
  editFeature,
  deleteFeature,
  setAddPointGeometry,
  startEditUpload,
  editUploadFailed,
  editUploaded,
  uploadEdits
} from '../../app/actions/edit'
import { getFeature } from '../test-utils'
import fs from 'fs'
import path from 'path'
import state from '../fixtures/state.json'
import stateConflict from '../fixtures/state-conflict.json'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

const mockFeature1 = getFeature('node/1')

// set mock date
advanceTo(1000)

describe('test sync edit actions', () => {
  it('should ADD_FEATURE', () => {
    const store = mockStore({})
    store.dispatch(addFeature(mockFeature1, 'test comment'))
    const actions = store.getActions()
    expect(actions[0]).toEqual({
      type: 'ADD_FEATURE',
      feature: mockFeature1,
      id: 'node/1',
      comment: 'test comment',
      timestamp: 1000
    })
  })

  it('should EDIT_FEATURE', () => {
    const store = mockStore({})
    const oldFeature = getFeature('node/1', { 'building': 'yes' })
    const newFeature = getFeature('node/1', { 'building': 'no' })
    store.dispatch(editFeature(oldFeature, newFeature, 'test comment'))
    const actions = store.getActions()
    expect(actions[0]).toEqual({
      type: 'EDIT_FEATURE',
      oldFeature,
      newFeature,
      id: 'node/1',
      comment: 'test comment',
      timestamp: 1000
    })
  })

  it('should DELETE_FEATURE', () => {
    const store = mockStore({})
    const feature = getFeature('node/1')
    store.dispatch(deleteFeature(feature, 'test comment'))
    const actions = store.getActions()
    expect(actions[0]).toEqual({
      type: 'DELETE_FEATURE',
      feature: feature,
      id: 'node/1',
      comment: 'test comment',
      timestamp: 1000
    })
  })

  it('should SET_ADD_POINT_GEOMETRY', () => {
    const store = mockStore({})
    store.dispatch(setAddPointGeometry([-1, 1]))
    const actions = store.getActions()
    expect(actions[0]).toEqual({
      type: 'SET_ADD_POINT_GEOMETRY',
      geometry: [-1, 1]
    })
  })

  it('should start edit upload', () => {
    const store = mockStore({})
    const edit = {
      oldFeature: null,
      newFeature: getFeature('node/1'),
      id: 'node/1'
    }
    store.dispatch(startEditUpload(edit))
    const actions = store.getActions()
    expect(actions[0]).toEqual({
      type: 'EDIT_UPLOAD_STARTED',
      edit: edit
    })
  })

  it('should handle upload failed', () => {
    const store = mockStore({})
    const edit = {
      oldFeature: null,
      newFeature: getFeature('node/1'),
      id: 'node/1'
    }
    const error = new UploadNetworkError()
    store.dispatch(editUploadFailed(edit, error))
    const actions = store.getActions()
    expect(actions[0]).toEqual({
      type: 'EDIT_UPLOAD_FAILED',
      edit,
      error: error.toJSON()
    })
  })

  it('should handle upload success', () => {
    const store = mockStore({})
    const edit = {
      oldFeature: null,
      newFeature: getFeature('node/1'),
      id: 'node/1'
    }
    const changesetId = '123'
    store.dispatch(editUploaded(edit, changesetId))
    const actions = store.getActions()
    expect(actions[0]).toEqual({
      type: 'EDIT_UPLOADED',
      edit,
      changesetId,
      timestamp: 1000
    })
  })
})

describe('test async edit actions', () => {
  it('should UPLOAD_EDITS', () => {
    const store = mockStore(state)
    const edit = {
      oldFeature: null,
      newFeature: { 'type': 'Feature', 'id': 'node/observe-vfxnxtmo20j', 'geometry': { 'type': 'Point', 'coordinates': [-77.02933996149397, 38.89503041477742] }, 'properties': { 'id': 'node/observe-vfxnxtmo20j', 'version': 1, 'name': 'Test', 'building': 'yes', 'icon': 'maki_marker' } },
      id: 'node/observe-vfxnxtmo20j'
    }
    const xmlDiffResponse = fs.readFileSync(path.join(__dirname, '../fixtures/osm-change-upload-response.xml'), 'utf-8')
    const osmResponseforTileUpdate = fs.readFileSync(path.join(__dirname, '../fixtures/osm-response-for-updated-tile.xml'), 'utf-8')

    fetch
      .once('1') // open changeset
      .once(xmlDiffResponse) // upload osm change
      .once({ status: 200 }) // close changeset
      .once(osmResponseforTileUpdate)

    return store.dispatch(uploadEdits([edit.id]))
      .then(() => {
        const actions = store.getActions()
        const types = []
        actions.forEach(action => {
          types.push(action.type)
        })
        expect(types).toStrictEqual([ 'EDIT_UPLOAD_STARTED',
          'EDIT_UPLOADED',
          'REQUESTED_TILE',
          'LOADING_DATA_FOR_TILE',
          'LOADED_DATA_FOR_TILE',
          'UPDATE_VISIBLE_BOUNDS',
          'REQUESTED_TILE',
          'REQUESTED_TILE' ])

        expect(actions).toMatchSnapshot()
      })
  })

  it('should raise VersionMismatchError', () => {
    const store = mockStore(stateConflict)
    const edit = {
      oldFeature: {
        'type': 'Feature',
        'id': 'node/1',
        'geometry': {
          'type': 'Point',
          'coordinates': [
            -77.02937206507221,
            38.89497324828185
          ]
        },
        'properties': {
          'id': 'node/1',
          'version': 1,
          'name': 'Test',
          'building': 'house',
          'icon': 'maki_marker'
        }
      },
      newFeature: {
        'type': 'Feature',
        'id': 'node/1',
        'geometry': {
          'type': 'Point',
          'coordinates': [
            -77.02937206507221,
            38.89497324828185
          ]
        },
        'properties': {
          'id': 'node/1',
          'version': 1,
          'name': 'Test',
          'building': 'yes',
          'icon': 'maki_marker'
        }
      },
      id: 'node/1'
    }

    fetch.resetMocks()
    fetch
      .once('1') // open changeset
      .once('Version mismatch: Provided 1, server had: 2 of Node 1', { status: 409 }) // upload osm change

    return store.dispatch(uploadEdits([edit.id]))
      .then(() => {
        const actions = store.getActions()
        expect(actions).toMatchSnapshot()
      })
  })
})
