import * as types from './actionTypes'
import RNFetchBlob from 'rn-fetch-blob'
import getRandomId from '../utils/get-random-id'
import * as ImageManipulator from 'expo-image-manipulator'

export function savePhoto (uri, location, description) {
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
        'description': description,
        'pending': true
      }
      dispatch({
        type: types.SAVED_PHOTO,
        photo
      })
    } catch (error) {
      console.log('Failed to save photo', error)
      dispatch({
        type: types.SAVE_PHOTO_FAILED,
        uri: uri
      })
    }
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
  console.log('delete photo action')
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
