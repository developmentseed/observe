import * as types from './actionTypes'
import { getFeaturesFromState } from '../selectors'

import modifySharedWays from '../utils/modify-shared-ways'
import { isInvalidFeature } from '../utils/utils'
import { setNotification, unsetNotification } from '../actions/notification'

export function addNode (node) {
  return (dispatch, getState) => {
    let modifiedSharedWays
    if (node.properties.ways) {
      const sharedWays = getFeaturesFromState(getState(), Object.keys(node.properties.ways))
      if (sharedWays.length) {
        modifiedSharedWays = modifySharedWays.addNode(sharedWays, node)
      }
    }
    dispatch({
      type: types.WAY_EDIT_ADD_NODE,
      node,
      modifiedSharedWays
    })
  }
}

export function moveSelectedNode (node, coordinates) {
  return (dispatch, getState) => {
    // if the node has other ways that it is a member of
    // find those ways from the state, and dispatch edit on that way as well
    let modifiedSharedWays
    if (node.properties.ways) {
      const sharedWays = getFeaturesFromState(getState(), Object.keys(node.properties.ways))
      if (sharedWays.length) {
        modifiedSharedWays = modifySharedWays.moveNode(sharedWays, node, coordinates)
      }
    }

    dispatch({
      type: types.WAY_EDIT_MOVE_NODE,
      node,
      coordinates,
      modifiedSharedWays
    })
  }
}

export function deleteSelectedNode (node) {
  return (dispatch, getState) => {
    let modifiedSharedWays
    if (node.properties.ways) {
      const sharedWays = getFeaturesFromState(getState(), Object.keys(node.properties.ways))
      if (sharedWays.length) {
        modifiedSharedWays = modifySharedWays.deleteNode(sharedWays, node)

        // check if any of the ways will be deleted
        // and show a notification
        const showDeleteWarning = modifiedSharedWays.some(feature => {
          return isInvalidFeature(feature)
        })

        if (showDeleteWarning) {
          dispatch(setNotification({
            level: 'info',
            message: 'A way will be deleted'
          }))

          setTimeout(() => {
            dispatch(unsetNotification())
          }, 1000)
        }
      }
    }

    dispatch({
      type: types.WAY_EDIT_DELETE_NODE,
      node,
      modifiedSharedWays
    })
  }
}

export function mergeSelectedNode (sourceNode, destinationNode) {
  return (dispatch, getState) => {
    let modifiedSharedWays
    if (sourceNode.properties.ways) {
      const sharedWays = getFeaturesFromState(getState(), Object.keys(sourceNode.properties.ways))
      if (sharedWays.length) {
        modifiedSharedWays = modifySharedWays.mergeNode(sharedWays, sourceNode, destinationNode)
      }
    }

    dispatch({
      type: types.WAY_EDIT_MERGE_NODE,
      sourceNode,
      destinationNode,
      modifiedSharedWays
    })
  }
}
