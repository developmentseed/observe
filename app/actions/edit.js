import * as types from './actionTypes'
// import uploadEdit from '../utils/upload-edit'
import { featureToTiles } from '../utils/bbox'
import { setNotification } from './notification'
import { fetchDataForTile, setSelectedFeatures } from './map'
import { getAllRetriable } from '../utils/edit-utils'
import {
  createChangeset,
  uploadOsmChange,
  closeChangeset,
  getMemberNodes
} from '../services/api'
import { version } from '../../package.json'
import getChangesetXML from '../utils/get-changeset-xml'
import editToOSMChange from '../utils//edit-to-osm-change'

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
 * @param {String} changesetComment - changeset comment for edits
 */
export function uploadEdits (editIds, changesetComment = 'Edited on Observe') {
  console.log('calling uploadEdits')
  const fn = async (dispatch, getState) => {
    console.log('really calling uploadEdits')
    const { isAuthorized } = getState().authorization

    if (!isAuthorized) {
      console.log('is authorized', isAuthorized)
      return
    }

    let changesetId
    const modifiedTiles = new Set()

    // create changeset
    const changesetTags = {
      created_by: `Observe-${version}`,
      comment: changesetComment
    }
    const changesetXML = getChangesetXML(changesetTags)

    try {
      changesetId = createChangeset(changesetXML)
    } catch (e) {
      dispatch({ level: 'error', message: 'Failed to create changeset.' })
    }

    console.log('changeset id', changesetId)
    // upload each edit to that changeset
    for (let editId of editIds) {
      console.log('uploading edit', editId)
      const allEdits = getState().edit.edits
      const edit = allEdits.find(e => e.id === editId)

      // if the edit no longer exists or is already uploading, do nothing for it
      if (!edit || edit.status === 'uploading') {
        console.log('skipping edit!')
        continue
      }
      console.log('starting edit upload')
      dispatch(startEditUpload(edit))
      let [featureType, featureId] = edit.id.split('/')
      let memberNodes = null
      if (edit.type === 'delete' && featureType === 'way') {
        try {
          memberNodes = await getMemberNodes(featureId, edit.oldFeature.properties.version)
        } catch (e) {
          dispatch(editUploadFailed(edit, e))
        }
      }
      const osmChangeXML = editToOSMChange(edit, changesetId, memberNodes)
      console.log('osm change xml', osmChangeXML)
      try {
        await uploadOsmChange(osmChangeXML, changesetId)
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

    try {
      console.log('closing changeset', changesetId)
      closeChangeset(changesetId)
    } catch (e) {
      dispatch(failedClosingChangeset(changesetId))
    }

    // refresh data
    await Promise.all(
      Array.from(modifiedTiles).map(tile =>
        dispatch(fetchDataForTile(tile, false, true))
      )
    )
  }

  // skip when offline
  // fn.interceptInOffline = true

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
  return {
    type: types.EDIT_UPLOADED,
    edit,
    changesetId,
    timestamp: Number(new Date())
  }
}

export function addFeature (feature) {
  return {
    type: types.ADD_FEATURE,
    feature,
    id: feature.id,
    timestamp: Number(new Date())
  }
}

export function deleteFeature (feature) {
  return async dispatch => {
    dispatch({
      type: types.DELETE_FEATURE,
      feature,
      id: feature.id,
      timestamp: Number(new Date())
    })
    dispatch(setSelectedFeatures([]))
  }
}

export function editFeature (oldFeature, newFeature) {
  return async dispatch => {
    dispatch({
      type: types.EDIT_FEATURE,
      oldFeature,
      newFeature,
      id: newFeature.id,
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
