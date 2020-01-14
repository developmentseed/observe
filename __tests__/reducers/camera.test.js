/* global describe, it, expect */

import reducer from '../../app/reducers/camera'
import { getMockPhoto } from '../test-utils'

const initialState = {
  photos: [],
  editedPhotos: [],
  deletedPhotoIds: []
}

describe('test edit photo reducer', () => {
  it('skip pending photos', () => {
    const photo = getMockPhoto({})

    const state = {
      ...initialState,
      photos: [ photo ]
    }

    const action = {
      type: 'EDIT_PHOTO',
      photo,
      description: 'new description',
      featureId: null
    }

    const newState = reducer(state, action)
    expect(newState.editedPhotos.length).toEqual(0)
  })

  it('only add to editedPhotos if the description is edited', () => {
    const photo = getMockPhoto({
      'apiId': 'UAUUAUA',
      'description': 'bus stop'
    })
    const state = {
      ...initialState,
      photos: [ photo ]
    }

    const action = {
      type: 'EDIT_PHOTO',
      photo,
      description: 'school',
      featureId: null
    }

    const newState = reducer(state, action)
    expect(newState.editedPhotos.length).toEqual(1)
  })
})
