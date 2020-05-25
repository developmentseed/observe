import * as types from '../actions/actionTypes'
import editsToGeojson from '../utils/edits-to-geojson'
<<<<<<< HEAD
import { EDIT_PENDING_STATUS, EDIT_SUCCEEDED_STATUS, EDIT_UPLOADING_STATUS } from '../constants'
=======
import editToOsmChange from '../utils/edit-to-osm-change'
>>>>>>> DEBUG: add console.logs to make debugging changeset generation easier

const initialState = {
  edits: [], // array of edit actions
  uploadedEdits: [], // array of successfully uploaded edits
  editsGeojson: {
    'type': 'FeatureCollection',
    'features': []
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.ADD_FEATURE: {
      let edits = [...state.edits]
      edits.push({
        type: 'create',
        newFeature: action.feature,
        oldFeature: null,
        comment: action.comment,
        id: action.id,
        status: EDIT_PENDING_STATUS,
        errors: [],
        timestamp: action.timestamp
      })

      // FIXME: remove
      console.log(editToOsmChange(edits.slice(-1)[0]), 123)
      let editsGeojson = editsToGeojson(edits)
      return {
        ...state,
        edits,
        editsGeojson
      }
    }

    case types.EDIT_FEATURE: {
      let edits = [...state.edits]
      const existingEditForId = edits.findIndex(e => e.id === action.newFeature.id)
      if (existingEditForId !== -1) {
        // edit already exists, replace newFeature
        edits[existingEditForId].newFeature = action.newFeature
        edits[existingEditForId].comment = action.comment
        edits[existingEditForId].timestamp = action.timestamp
      } else {
        edits.push({
          type: 'modify',
          oldFeature: action.oldFeature,
          newFeature: action.newFeature,
          comment: action.comment,
          id: action.id,
          status: EDIT_PENDING_STATUS,
          errors: [],
          timestamp: action.timestamp
        })
      }
      // FIXME: remove
      console.log(editToOsmChange(edits.slice(-1)[0]), 123)
      let editsGeojson = editsToGeojson(edits)
      return {
        ...state,
        edits,
        editsGeojson
      }
    }

    case types.DELETE_FEATURE: {
      let edits = [...state.edits]

      // if edit exists in edits
      const existingEditForId = edits.findIndex(e => e.newFeature && e.newFeature.id === action.id)

      // pending action exists for this feature id
      if (existingEditForId !== -1 && edits[existingEditForId].status === EDIT_PENDING_STATUS) {
        const currentEdit = edits[existingEditForId]
        if (currentEdit.type === 'create') { // created feature not been uploaded, just remove from queue
          edits = edits.filter(e => e.id !== action.id)
        } else { // current edit is 'modify', change the edit to a delete action
          edits[existingEditForId] = {
            ...edits[existingEditForId],
            type: 'delete',
            newFeature: null,
            comment: action.comment,
            timestamp: action.timestamp
          }
        }
      } else { // no pending action for current id, just create a delete edit
        edits.push({
          type: 'delete',
          oldFeature: action.feature,
          newFeature: null,
          id: action.id,
          comment: action.comment,
          status: EDIT_PENDING_STATUS,
          errors: [],
          timestamp: action.timestamp
        })
      }
      
      // FIXME: remove
      console.log(editToOsmChange(edits.slice(-1)[0]), 123)
      let editsGeojson = editsToGeojson(edits)
      return {
        ...state,
        edits,
        editsGeojson
      }
    }

    case types.EDIT_UPLOADED: {
      let edits = [...state.edits]

      // remove uploaded edit from edits
      edits = edits.filter(edit => edit.id !== action.edit.id)
      let editsGeojson = editsToGeojson(edits)
      const uploadedEdits = [...state.uploadedEdits]
      const uploadedEdit = { ...action.edit }

      // add changesetId to the edit
      uploadedEdit.changesetId = action.changesetId
      uploadedEdit.status = EDIT_SUCCEEDED_STATUS
      uploadedEdit.uploadTimestamp = action.timestamp

      // add uploaded edit to uploadedEdits
      uploadedEdits.push(uploadedEdit)
      return {
        ...state,
        edits,
        uploadedEdits,
        editsGeojson
      }
    }

    case types.EDIT_UPLOAD_STARTED: {
      let edits = [...state.edits]
      const startedIndex = edits.findIndex(edit => edit.id === action.edit.id)
      edits[startedIndex] = {
        ...edits[startedIndex],
        status: EDIT_UPLOADING_STATUS
      }
      return {
        ...state,
        edits
      }
    }

    case types.EDIT_UPLOAD_FAILED: {
      let edits = [...state.edits]
      const failedIndex = edits.findIndex(edit => edit.id === action.edit.id)
      edits[failedIndex] = {
        ...edits[failedIndex],
        status: EDIT_PENDING_STATUS,
        errors: [...edits[failedIndex].errors]
      }
      edits[failedIndex].errors.push(action.error)
      return {
        ...state,
        edits
      }
    }

    case types.CLEAR_EDIT: {
      let edits = [...state.edits]
      let uploadedEdits = [...state.uploadedEdits]
      edits = edits.filter(e => !(e.timestamp === action.edit.timestamp && e.id === action.edit.id))
      uploadedEdits = uploadedEdits.filter(e => !(e.timestamp === action.edit.timestamp && e.id === action.edit.id))
      let editsGeojson = editsToGeojson(edits)
      return {
        ...state,
        edits,
        editsGeojson,
        uploadedEdits
      }
    }

    case types.CLEAR_UPLOADED_EDITS: {
      return {
        ...state,
        uploadedEdits: []
      }
    }

    case types.PURGE_ALL_EDITS: {
      return {
        ...state,
        edits: [],
        editsGeojson: {
          type: 'FeatureCollection',
          features: []
        }
      }
    }

    case types.SET_EDIT_STATUS: {
      const { editId, status } = action
      let edit = state.edits.find(e => e.id === editId)
      const edits = state.edits
        .filter(e => e.id !== editId)
        .concat({
          ...edit,
          status: status
        })
      return {
        ...state,
        edits
      }
    }

    case types.MODIFY_EDIT_VERSION: {
      const { editId: id, newVersion: version } = action

      const edit = state.edits.find(e => e.id === id)

      const feature = edit.type === 'delete' ? 'oldFeature' : 'newFeature'

      // generate a new list of edits without the one being modified and append an updated copy
      const edits = state.edits
        .filter(e => e.id !== id)
        .concat({
          ...edit,
          [feature]: {
            ...edit[feature],
            properties: {
              ...edit[feature].properties,
              version
            }
          }
        })

      return {
        ...state,
        edits
      }
    }

    case types.MODIFY_EDIT_TO_CREATE: {
      const { editId: id } = action

      const edit = state.edits.find(e => e.id === id)

      // generate a new list of edits without the one being modified and append an updated copy
      const edits = state.edits
        .filter(e => e.id !== id)
        .concat({
          ...edit,
          type: 'create',
          newFeature: {
            ...edit.newFeature,
            properties: {
              ...edit.newFeature.properties,
              version: 1
            }
          }
        })

      return {
        ...state,
        edits
      }
    }

    case types.SET_ADD_POINT_GEOMETRY: {
      return {
        ...state,
        addPointGeometry: action.geometry
      }
    }
  }
  return state
}
