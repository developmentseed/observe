import * as types from '../actions/actionTypes'
import _findIndex from 'lodash.findindex'
import _cloneDeep from 'lodash.clonedeep'

export const initialState = {
  photos: [],
  deletedPhotoIds: []
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
      editedPhoto.featureId = action.featureId
      photos.push(editedPhoto)
      return {
        ...state,
        photos
      }
    }

    case types.DELETED_PHOTO: {
      let photos = [...state.photos]
      photos = photos.filter(photo => photo.id !== action.photo)
      let deletedPhotoIds = _cloneDeep(photos.deletedPhotoIds)
      if (action.photo.hasOwnProperty('apiId')) {
        deletedPhotoIds.push(action.photo.apiId)
      }
      return {
        ...state,
        photos,
        deletedPhotoIds
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

    case types.DELETED_PENDING_PHOTO: {
      let deletedPhotoIds = _cloneDeep(state.deletedPhotoIds)
      deletedPhotoIds = deletedPhotoIds.filter(id => id !== action.photoId)
      return {
        ...state,
        deletedPhotoIds
      }
    }

    case types.DELETE_PENDING_PHOTO_FAILED: {
      if (action.error.status === 404) {
        let deletedPhotoIds = _cloneDeep(state.deletedPhotoIds)
        deletedPhotoIds = deletedPhotoIds.filter(id => id !== action.photoId)
        return {
          ...state,
          deletedPhotoIds
        }
      } else {
        break
      }
    }

    case types.CLEAR_UPLOADED_PHOTOS: {
      let photos = _cloneDeep(state.photos)
      photos = photos.filter(photo => photo.status !== 'uploaded')
      return {
        ...state,
        photos
      }
    }
  }
  return state
}
