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
  editUploaded
} from '../../app/actions/edit'
import { getFeature } from '../test-utils'

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
