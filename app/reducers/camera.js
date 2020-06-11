import * as types from '../actions/actionTypes'
import _findIndex from 'lodash.findindex'
import _cloneDeep from 'lodash.clonedeep'
import { PHOTO_PENDING_EDIT_STATUS, PHOTO_UPLOADING_STATUS, PHOTO_PENDING_STATUS, PHOTO_UPLOADED_STATUS } from '../constants'

export const initialState = {
  photos: [],
  deletedPhotoIds: [],
  editedPhotos: []
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.SAVED_PHOTO: {
      let photos = [...state.photos]
      photos.push(action.photo)
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
      let editedPhotos = [...state.editedPhotos]
      let photos = [...state.photos]
      photos = photos.filter(photo => photo.id !== action.photo.id)
      // if photo has apiId, add it to editedPhotos to submit to the API
      if (editedPhoto.apiId && (editedPhoto.description !== action.description)) {
        editedPhoto.status = PHOTO_PENDING_EDIT_STATUS
        // check if there's an edit that's pending
        const index = _findIndex(editedPhotos, p => p.id === editedPhoto.id)
        if (index > -1) {
          editedPhotos[index] = editedPhoto
        } else {
          editedPhotos.push(editedPhoto)
        }
      }
      editedPhoto.description = action.description
      editedPhoto.featureId = action.featureId
      photos.push(editedPhoto)
      return {
        ...state,
        photos,
        editedPhotos
      }
    }

    case types.DELETED_PHOTO: {
      let photos = [...state.photos]
      photos = photos.filter(photo => photo.id !== action.photo.id)
      let deletedPhotoIds = _cloneDeep(state.deletedPhotoIds)
      if (action.photo.hasOwnProperty('apiId')) {
        deletedPhotoIds.push(action.photo.apiId)
      }
      return {
        ...state,
        photos,
        deletedPhotoIds
      }
    }

    case types.UPLOADING_PHOTO: {
      const photos = _cloneDeep(state.photos)
      const index = _findIndex(state.photos, p => p.id === action.photo.id)
      photos[index].status = PHOTO_UPLOADING_STATUS
      photos[index].errors.push(action.error)
      return {
        ...state,
        photos
      }
    }

    case types.UPLOAD_PHOTO_FAILED: {
      const photos = _cloneDeep(state.photos)
      const index = _findIndex(state.photos, p => p.id === action.photo.id)
      photos[index].status = PHOTO_PENDING_STATUS
      photos[index].errors.push(action.error)
      return {
        ...state,
        photos
      }
    }

    case types.UPLOADED_PHOTO: {
      const photos = _cloneDeep(state.photos)
      const index = _findIndex(state.photos, p => p.id === action.oldId)
      photos[index].status = PHOTO_UPLOADED_STATUS
      photos[index].apiId = action.newId
      photos[index].uploadedAt = action.uploadedAt
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
      photos = photos.filter(photo => photo.status !== PHOTO_UPLOADED_STATUS)
      return {
        ...state,
        photos
      }
    }

    case types.UPLOADED_PENDING_PHOTO_EDIT: {
      const photos = _cloneDeep(state.photos)
      const index = _findIndex(state.photos, p => p.apiId === action.photo.apiId)
      let editedPhotos = _cloneDeep(state.editedPhotos)
      photos[index].status = PHOTO_UPLOADED_STATUS
      editedPhotos = editedPhotos.filter(p => p.apiId === action.photo.apiId)
      return {
        ...state,
        editedPhotos,
        photos
      }
    }

    case types.UPLOAD_PENDING_PHOTO_EDIT_FAILED: {
      if (action.error.status === 404) {
        let editedPhotos = _cloneDeep(state.editedPhotos)
        editedPhotos = editedPhotos.filter(photo => photo.apiId !== action.photo.apiId)
        return {
          ...state,
          editedPhotos
        }
      } else {
        break
      }
    }
  }
  return state
}
