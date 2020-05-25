import * as types from './actionTypes'
import uploadEdit from '../utils/upload-edit'
import { featureToTiles } from '../utils/bbox'
import { setNotification } from './notification'
import { fetchDataForTile, setSelectedFeatures } from './map'
import { getAllRetriable } from '../utils/edit-utils'
import { getPhotosForFeature } from '../utils/photos'
import { getFeatureInChangeset } from '../services/osm-api'
import { editPhoto } from '../actions/camera'
import { EDIT_UPLOADING_STATUS } from '../constants'
import { clearNodeCacheForTile } from '../services/nodecache'
/**
 * Retries all retriable edits in the current state
 */
export function retryAllEdits () {
  return (dispatch, getState) => {
    const edits = getState().edit.edits
    const retriableIds = getAllRetriable(edits).map(e => e.id)
    dispatch(uploadEdits(retriableIds))
  }
}

/**
 * @param {Array<String>} editIds - Array of edit ids (feature ids) to be uploaded
 */
export function uploadEdits (editIds) {
  const fn = async (dispatch, getState) => {
    const { isAuthorized } = getState().authorization

    if (!isAuthorized) {
      return
    }

    const modifiedTiles = new Set()

    for (let editId of editIds) {
      const allEdits = getState().edit.edits
      const edit = allEdits.find(e => e.id === editId)

      // if the edit no longer exists or is already uploading, do nothing for it
      if (!edit || edit.status === EDIT_UPLOADING_STATUS) {
        continue
      }
      dispatch(startEditUpload(edit))
      try {
        const changesetId = await uploadEdit(edit)
        dispatch(editUploaded(edit, changesetId))
        const feature = edit.type === 'delete' ? edit.oldFeature : edit.newFeature

        // update the list of modified tiles with ones that touch the feature being uploaded
        featureToTiles(feature).forEach(modifiedTiles.add, modifiedTiles)
      } catch (e) {
        console.warn('Upload failed', e, edit)
        dispatch(setNotification({ level: 'error', message: 'Upload failed' }))
        dispatch(editUploadFailed(edit, e))
      }
    }

    // clear modified tiles from the nodecache and refresh data
    const promises = []
    const modifiedTilesList = Array.from(modifiedTiles)
    for (let index = 0; index < modifiedTilesList.length; index++) {
      const tile = modifiedTilesList[index]
      promises.push(await clearNodeCacheForTile(tile))
      promises.push(dispatch(fetchDataForTile(tile, false, true)))
    }

    await Promise.all(promises)
  }

  // skip when offline
  fn.interceptInOffline = true

  return fn
}

export function startEditUpload (edit) {
  return {
    type: types.EDIT_UPLOAD_STARTED,
    edit
  }
}

export function editUploadFailed (edit, error) {
  return {
    type: types.EDIT_UPLOAD_FAILED,
    edit,
    error: error.toJSON()
  }
}

export function setEditStatus (editId, status) {
  return {
    type: types.SET_EDIT_STATUS,
    editId,
    status
  }
}

export function purgeAllEdits () {
  return {
    type: types.PURGE_ALL_EDITS
  }
}

export function editUploaded (edit, changesetId) {
  return async (dispatch, getState) => {
    dispatch({
      type: types.EDIT_UPLOADED,
      edit,
      changesetId,
      timestamp: Number(new Date())
    })

    // check if there are any photos associated with this edit
    if (edit.type === 'create') {
      const photos = getState().photos.photos
      const associatedPhotos = getPhotosForFeature(photos, edit.id)
      if (associatedPhotos.length) {
        // get feature id
        const featureId = await getFeatureInChangeset(changesetId)
        // fire action to update each photo feature id
        for (let photo of associatedPhotos) {
          dispatch(editPhoto(photo, photo.description, featureId))
        }
      } else {
        // no photos associated. nothing to do
      }
    }
  }
}

export function addFeature (feature, comment = '') {
  return (dispatch, getState) => {
    const state = getState()
    if (state.wayEditingHistory.present.addedNodes.length > 0) { // is a way edit, copy over wayEditHistory
      feature.wayEditingHistory = { ...state.wayEditingHistory.present }
    }
    dispatch({
      type: types.ADD_FEATURE,
      feature,
      id: feature.id,
      comment,
      timestamp: Number(new Date())
    })
  }
}

export function deleteFeature (feature, comment = '') {
  return async dispatch => {
    dispatch({
      type: types.DELETE_FEATURE,
      feature,
      id: feature.id,
      comment,
      timestamp: Number(new Date())
    })
    dispatch(setSelectedFeatures([]))
  }
}

export function editFeature (oldFeature, newFeature, comment = '') {
  return async (dispatch, getState) => {
    const state = getState()
    if (state.wayEditingHistory.present.modifiedSharedWays.length > 0) { // is a way edit
      newFeature.wayEditingHistory = { ...state.wayEditingHistory.present }
    }
    dispatch({
      type: types.EDIT_FEATURE,
      oldFeature,
      newFeature,
      id: newFeature.id,
      comment,
      timestamp: Number(new Date())
    })
    dispatch(setSelectedFeatures([]))
  }
}

export function clearEdit (edit) {
  return {
    type: types.CLEAR_EDIT,
    edit
  }
}

export function setAddPointGeometry (point) {
  return {
    type: types.SET_ADD_POINT_GEOMETRY,
    geometry: point
  }
}

export function expireTiles (tiles) {
  return {
    type: types.EXPIRE_TILES,
    tiles
  }
}

export function clearUploadedEdits () {
  return {
    type: types.CLEAR_UPLOADED_EDITS
  }
}

export function modifyEditVersion (editId, newVersion) {
  return {
    type: types.MODIFY_EDIT_VERSION,
    editId,
    newVersion
  }
}

// Used to modify a "modify" action to a create action, in case of a conflict where
// the upstream feature has been deleted
export function modifyEditToCreate (editId) {
  return {
    type: types.MODIFY_EDIT_TO_CREATE,
    editId
  }
}
