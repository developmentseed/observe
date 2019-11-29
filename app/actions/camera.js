import * as types from './actionTypes'
import RNFetchBlob from 'rn-fetch-blob'
import getRandomId from '../utils/get-random-id'
import * as ImageManipulator from 'expo-image-manipulator'
import * as api from '../services/observe-api'

export function savePhoto (uri, location, description, featureId) {
  return async dispatch => {
    dispatch({
      type: types.SAVING_PHOTO,
      uri: uri
    })
    const id = getRandomId()
    const directoryPath = `${RNFetchBlob.fs.dirs.DocumentDir}/photos`
    const path = `${RNFetchBlob.fs.dirs.DocumentDir}/photos/${id}.jpg`
    try {
      await RNFetchBlob.fs.mkdir(directoryPath)
    } catch (error) {
      if (!error.message.endsWith('already exists')) {
        console.log('directory create failed', error)
      }
    }
    try {
      let manipulatedImage = await ImageManipulator.manipulateAsync(uri, [
        // FIXME: figure out a resizing strategy once API is hooked up
        // { resize: { width: 540, height: 780 } }
      ], { base64: true, compress: 0.2 })
      await RNFetchBlob.fs.createFile(path, manipulatedImage.uri.replace('file://', ''), 'uri')

      const photo = {
        'id': id,
        'path': path,
        'location': location,
        'description': description || null,
        'status': 'pending',
        'featureId': featureId || null,
        'errors': [],
        'base64': manipulatedImage.base64
      }
      dispatch(savedPhoto(photo))
    } catch (error) {
      console.log('Failed to save photo', error)
      dispatch({
        type: types.SAVE_PHOTO_FAILED,
        uri: uri
      })
    }
  }
}

export function savedPhoto (photo) {
  return (dispatch) => {
    dispatch({
      type: types.SAVED_PHOTO,
      photo
    })
    dispatch(uploadPendingPhotos())
  }
}

export function editPhoto (photo, description) {
  return {
    type: types.EDIT_PHOTO,
    photo,
    description
  }
}

export function deletePhoto (photo) {
  return async dispatch => {
    dispatch({
      type: types.DELETING_PHOTO,
      photo: photo
    })

    const path = `${RNFetchBlob.fs.dirs.DocumentDir}/photos/${photo}.jpg`
    try {
      await RNFetchBlob.fs.unlink(path)
    } catch (err) {
      console.log('File unlink failed', err)
      dispatch({
        type: types.DELETE_PHOTO_FAILED,
        photo: photo
      })
    }
    dispatch({
      type: types.DELETED_PHOTO,
      photo
    })
  }
}

export function uploadPendingPhotos () {
  return async (dispatch, getState) => {
    const { photos } = getState().photos
    const pendingPhotos = photos.filter(photo => photo.status === 'pending')
    for (let photo of pendingPhotos) {
      dispatch(uploadingPhoto(photo))
      try {
        // FIXME: make sure the api method is returning the newId
        const newId = await api.uploadPhoto(dispatch, photo)
        dispatch(uploadedPhoto(photo.id, newId))
      } catch (e) {
        dispatch(uploadPhotoFailed(photo, e))
      }
    }
  }
}

export function uploadingPhoto (photo) {
  return {
    type: types.UPLOADING_PHOTO,
    photo
  }
}

export function uploadedPhoto (oldId, newId) {
  return {
    type: types.UPLOADED_PHOTO,
    oldId,
    newId
  }
}

export function uploadPhotoFailed (photo, error) {
  return {
    type: types.UPLOAD_PHOTO_FAILED,
    photo,
    error
  }
}
