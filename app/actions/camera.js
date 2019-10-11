import * as types from './actionTypes'
import RNFetchBlob from 'rn-fetch-blob'
import getRandomId from '../utils/get-random-id'

export function savePhoto (uri) {
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
      await RNFetchBlob.fs.createFile(path, uri, 'uri')
      dispatch({
        type: types.SAVED_PHOTO,
        path: path,
        id: id
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
