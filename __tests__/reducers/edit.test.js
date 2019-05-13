/* global describe */
/* global it */
/* global expect */

import reducer from '../../app/reducers/edit'
import { getFeature } from '../test-utils'

function getInitialState () {
  return {
    edits: [],
    uploadedEdits: []
  }
}

const mockFeature1 = getFeature('node/1')

describe('reducer for edit related actions', () => {
  it('should add features to edits correctly when edits is empty', () => {
    const mockState = getInitialState()
    const action = {
      type: 'ADD_FEATURE',
      feature: mockFeature1,
      id: mockFeature1.id,
      comment: 'test',
      timestamp: 1000
    }
    const newState = reducer(mockState, action)
    const expectedEdits = [
      {
        type: 'create',
        newFeature: mockFeature1,
        oldFeature: null,
        id: mockFeature1.id,
        status: 'pending',
        errors: [],
        comment: 'test',
        timestamp: 1000
      }
    ]
    expect(newState.edits).toEqual(expectedEdits)
  })

  it('should create an edit feature entry for EDIT_FEATURE when feature does not already exist', () => {
    const mockState = getInitialState()
    const oldFeature = getFeature('node/1', { building: 'yes' })
    const newFeature = getFeature('node/1', { building: 'no' })
    const action = {
      type: 'EDIT_FEATURE',
      oldFeature,
      newFeature,
      id: newFeature.id,
      comment: 'test',
      timestamp: 1000
    }
    const newState = reducer(mockState, action)
    const expectedEdits = [
      {
        type: 'modify',
        oldFeature,
        newFeature,
        id: newFeature.id,
        status: 'pending',
        errors: [],
        comment: 'test',
        timestamp: 1000
      }
    ]
    expect(newState.edits).toEqual(expectedEdits)
  })

  it('should append an edit entry correctly', () => {
    const oldFeature1 = getFeature('node/1', { building: 'yes' })
    const newFeature1 = getFeature('node/1', { building: 'no' })
    const oldFeature2 = getFeature('node/2', { highway: 'primary' })
    const newFeature2 = getFeature('node/2', { highway: 'secondary' })
    const mockState = {
      ...getInitialState(),
      edits: [{
        type: 'modify',
        oldFeature: oldFeature1,
        newFeature: newFeature1,
        id: newFeature1.id,
        status: 'pending',
        errors: [],
        timestamp: 500,
        comment: 'test1'
      }]
    }
    const action = {
      type: 'EDIT_FEATURE',
      oldFeature: oldFeature2,
      newFeature: newFeature2,
      id: newFeature2.id,
      timestamp: 1000,
      comment: 'test'
    }
    const newState = reducer(mockState, action)
    const expectedEdits = [{
      type: 'modify',
      oldFeature: oldFeature1,
      newFeature: newFeature1,
      id: newFeature1.id,
      errors: [],
      status: 'pending',
      comment: 'test1',
      timestamp: 500
    },
    {
      type: 'modify',
      oldFeature: oldFeature2,
      newFeature: newFeature2,
      id: newFeature2.id,
      errors: [],
      status: 'pending',
      comment: 'test',
      timestamp: 1000
    }]
    expect(newState.edits).toEqual(expectedEdits)
  })

  it('should modify existing entry when editing id that exists in edits', () => {
    const oldFeature1 = getFeature('node/1', { highway: 'primary' })
    const newFeature1 = getFeature('node/1', { highway: 'secondary' })
    const newFeature2 = getFeature('node/1', { highway: 'tertiary' })
    const mockState = {
      ...getInitialState(),
      edits: [{
        type: 'modify',
        oldFeature: oldFeature1,
        newFeature: newFeature1,
        id: newFeature1.id,
        status: 'pending',
        errors: [],
        comment: 'test',
        timestamp: 500
      }]
    }
    const action = {
      type: 'EDIT_FEATURE',
      oldFeature: newFeature1, // this is not a typo
      newFeature: newFeature2,
      id: newFeature2.id,
      comment: 'updated',
      timestamp: 1000
    }
    const newState = reducer(mockState, action)
    const expectedEdits = [{
      type: 'modify',
      oldFeature: oldFeature1, // old feature should remain unchanged
      newFeature: newFeature2,
      id: newFeature2.id,
      status: 'pending',
      errors: [],
      comment: 'updated',
      timestamp: 1000
    }]
    expect(newState.edits).toEqual(expectedEdits)
  })

  it('should handle DELETE_FEATURE when feature is not in current edits', () => {
    const feature = getFeature('node/1', { highway: 'primary' })
    const mockState = getInitialState()
    const action = {
      type: 'DELETE_FEATURE',
      feature: feature,
      id: feature.id,
      comment: 'test',
      timestamp: 1000
    }
    const newState = reducer(mockState, action)
    const expectedEdits = [{
      type: 'delete',
      oldFeature: feature,
      newFeature: null,
      id: feature.id,
      status: 'pending',
      errors: [],
      comment: 'test',
      timestamp: 1000
    }]
    expect(newState.edits).toEqual(expectedEdits)
  })

  it('should handle DELETE_FEATURE for existing create edit', () => {
    const feature = getFeature('node/-1', { highway: 'primary' })
    const mockState = {
      ...getInitialState(),
      edits: [{
        type: 'create',
        oldFeature: null,
        newFeature: feature,
        id: feature.id,
        status: 'pending',
        errors: [],
        comment: 'test',
        timestamp: 500
      }]
    }
    const action = {
      type: 'DELETE_FEATURE',
      feature: feature,
      id: feature.id,
      comment: 'updated',
      timestamp: 1000
    }
    const newState = reducer(mockState, action)
    expect(newState.edits).toEqual([])
  })

  it('should handle DELETE_FEATURE for existing modify edit', () => {
    const oldFeature = getFeature('node/1', { highway: 'primary' })
    const newFeature = getFeature('node/1', { highway: 'secondary' })
    const mockState = {
      ...getInitialState(),
      edits: [{
        type: 'modify',
        oldFeature: oldFeature,
        newFeature: newFeature,
        id: newFeature.id,
        status: 'pending',
        errors: [],
        comment: 'test',
        timestamp: 500
      }]
    }
    const action = {
      type: 'DELETE_FEATURE',
      feature: newFeature,
      id: newFeature.id,
      comment: 'updated',
      timestamp: 1000
    }
    const newState = reducer(mockState, action)
    expect(newState.edits).toEqual([{
      type: 'delete',
      oldFeature: oldFeature,
      newFeature: null,
      id: oldFeature.id,
      status: 'pending',
      errors: [],
      comment: 'updated',
      timestamp: 1000
    }])
  })

  it('should set addPointGeometry correctly', () => {
    const mockState = getInitialState()
    const action = {
      type: 'SET_ADD_POINT_GEOMETRY',
      geometry: [1, -1]
    }
    const newState = reducer(mockState, action)
    expect(newState.addPointGeometry).toEqual([1, -1])
  })

  it('should handle EDIT_UPLOAD_STARTED correctly', () => {
    const mockEdit = {
      type: 'create',
      oldFeature: getFeature('node/1'),
      newFeature: getFeature('node/1'),
      id: 'node/1',
      status: 'pending',
      errors: []
    }
    const mockState = {
      ...getInitialState(),
      edits: [mockEdit]
    }
    const action = {
      type: 'EDIT_UPLOAD_STARTED',
      edit: mockEdit
    }
    const newState = reducer(mockState, action)
    expect(newState.edits[0].status).toEqual('uploading')
  })

  it('should handle EDIT_UPLOAD_FAILED correctly', () => {
    const mockEdit = {
      type: 'create',
      oldFeature: getFeature('node/1'),
      newFeature: getFeature('node/1'),
      id: 'node/1',
      status: 'uploading',
      errors: []
    }
    const mockState = {
      ...getInitialState(),
      edits: [mockEdit]
    }
    const action = {
      type: 'EDIT_UPLOAD_FAILED',
      edit: mockEdit,
      error: new Error('test')
    }
    const newState = reducer(mockState, action)
    const newEdit = newState.edits[0]
    expect(newEdit.status).toEqual('pending')
    expect(newEdit.errors).toEqual([
      new Error('test')
    ])
  })

  it('should handle EDIT_UPLOADED correctly', () => {
    const mockEdit = {
      type: 'create',
      oldFeature: getFeature('node/1'),
      newFeature: getFeature('node/1'),
      id: 'node/1',
      status: 'uploading',
      errors: [],
      timestamp: 500
    }
    const mockState = {
      ...getInitialState(),
      edits: [
        mockEdit
      ]
    }
    const action = {
      type: 'EDIT_UPLOADED',
      edit: mockEdit,
      changesetId: '123',
      timestamp: 1000
    }
    const newState = reducer(mockState, action)
    expect(newState.edits.length).toEqual(0)
    expect(newState.uploadedEdits).toEqual([
      {
        ...mockEdit,
        changesetId: '123',
        status: 'success',
        timestamp: 500,
        uploadTimestamp: 1000
      }
    ])
  })
})
