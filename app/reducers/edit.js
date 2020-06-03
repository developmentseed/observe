import * as types from '../actions/actionTypes'
import editsToGeojson from '../utils/edits-to-geojson'
import _cloneDeep from 'lodash.clonedeep'

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
        status: 'pending',
        errors: [],
        timestamp: action.timestamp
      })

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
          status: 'pending',
          errors: [],
          timestamp: action.timestamp
        })
      }

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
      if (existingEditForId !== -1 && edits[existingEditForId].status === 'pending') {
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
          status: 'pending',
          errors: [],
          timestamp: action.timestamp
        })
      }

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
      uploadedEdit.status = 'success'
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
        status: 'uploading'
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
        status: 'pending',
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

    case types.NEW_NODE_MAPPING: {
      let edits = [...state.edits]

      // go through each edit
      // replace the observeid with new id
      if (edits.length) {
        edits.forEach(edit => {
          const feature = _cloneDeep(edit.newFeature)
          if (feature) {
            const newNdrefs = []
            const addedNodes = []
            const deletedNodes = []
            const mergedNodes = []
            const movedNodes = []
            const nodes = []

            const newNodeIdMap = action.newNodeIdMap
            const newNodeIdMapKeys = Object.keys(newNodeIdMap)

            // replace it in ndrefs of the way
            feature.properties.ndrefs.map(oldRef => {
              let newRef = oldRef
              if (newNodeIdMapKeys.includes(oldRef)) {
                newRef = action.newNodeIdMap[oldRef]
              }
              newNdrefs.push(newRef)
            }, newNdrefs)

            feature.properties.ndrefs = newNdrefs

            // replace it in addedNodes, deletedNodes, movedNodes, mergedNodes
            if (feature.wayEditingHistory.addedNodes.length) {
              feature.wayEditingHistory.addedNodes.map(oldRef => {
                let newRef = oldRef
                if (newNodeIdMapKeys.includes(oldRef)) {
                  newRef = action.newNodeIdMap[oldRef]
                }
                addedNodes.push(newRef)
              }, addedNodes)
            }
            feature.wayEditingHistory.addedNodes = addedNodes

            if (feature.wayEditingHistory.movedNodes.length) {
              feature.wayEditingHistory.movedNodes.map(oldRef => {
                let newRef = oldRef
                if (newNodeIdMapKeys.includes(oldRef)) {
                  newRef = action.newNodeIdMap[oldRef]
                }
                movedNodes.push(newRef)
              }, movedNodes)
            }
            feature.wayEditingHistory.movedNodes = movedNodes

            if (feature.wayEditingHistory.deletedNodes.length) {
              feature.wayEditingHistory.deletedNodes.map(oldRef => {
                let newRef = oldRef
                if (newNodeIdMapKeys.includes(oldRef)) {
                  newRef = action.newNodeIdMap[oldRef]
                }
                deletedNodes.push(newRef)
              }, deletedNodes)
            }
            feature.wayEditingHistory.deletedNodes = deletedNodes

            if (feature.wayEditingHistory.mergedNodes.length) {
              feature.wayEditingHistory.mergedNodes.map(oldRef => {
                const thisMerge = oldRef
                if (newNodeIdMapKeys.includes(oldRef.sourceNode)) {
                  thisMerge.sourceNode = action.newNodeIdMap[oldRef]
                }

                if (newNodeIdMapKeys.includes(oldRef.destinationNode)) {
                  thisMerge.destinationNode = action.newNodeIdMap[oldRef]
                }
                mergedNodes.push(thisMerge)
              }, mergedNodes)
            }
            feature.wayEditingHistory.mergedNodes = mergedNodes

            // replace it in wayEditHistory.way.nodes
            feature.wayEditingHistory.way.nodes.forEach(oldNode => {
              const thisNode = _cloneDeep(oldNode)
              if (newNodeIdMapKeys.includes(oldNode.properties.id)) {
                thisNode.id = action.newNodeIdMap[oldNode.properties.id]
                thisNode.properties.id = action.newNodeIdMap[oldNode.properties.id]
                thisNode.properties.version = 1
              }
              nodes.push(thisNode)
            })
            feature.wayEditingHistory.way.nodes = nodes
          }
          edit.newFeature = feature
        })
      }
      return {
        ...state,
        edits
      }
    }
  }
  return state
}
