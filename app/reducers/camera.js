import * as types from '../actions/actionTypes'
import _findIndex from 'lodash.findindex'
import _cloneDeep from 'lodash.clonedeep'

export const initialState = {
  photos: []
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.SAVED_PHOTO: {
      let photos = [...state.photos]
      photos.push(action.photo)
      console.log('saved', photos)
      return {
        ...state,
        photos
      }
    }

    case types.SAVE_PHOTO_FAILED: {
      console.log('save photo failed')
      break
    }

    case types.EDIT_PHOTO: {
      let editedPhoto = { ...action.photo }
      let photos = [...state.photos]
      photos = photos.filter(photo => photo.id !== action.photo.id)
      editedPhoto.description = action.description
      photos.push(editedPhoto)
      return {
        ...state,
        photos
      }
    }

    case types.DELETED_PHOTO: {
      let photos = [...state.photos]
      photos = photos.filter(photo => photo.id !== action.photo)
      return {
        ...state,
        photos
      }
    }

    case types.UPLOAD_PHOTO_FAILED: {
      const photos = _cloneDeep(state.photos)
      const index = _findIndex(state.photos, p => p.id === action.photo.id)
      photos[index].status = 'pending'
      photos[index].errors.push(action.error)
      return {
        ...state,
        photos
      }
    }
  }
  return state
}
