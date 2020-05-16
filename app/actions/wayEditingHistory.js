import _findIndex from 'lodash.findindex'
import _isEqual from 'lodash.isequal'

import * as types from './actionTypes'
import { getFeaturesFromState } from '../selectors'

import modifySharedWays from '../utils/modify-shared-ways'

export function addNode (node) {
  return (dispatch, getState) => {
    let index
    let modifiedSharedWays
    if (node.properties.ways) {
      const sharedWays = getFeaturesFromState(getState(), Object.keys(node.properties.ways))

      if (sharedWays.length) {
        const modified = modifySharedWays(sharedWays, node, null, 'ADD')
        index = modified.index
        modifiedSharedWays = modified.modifiedSharedWays
      }

      const wayId = node.properties.edge.id
      const way = sharedWays.find((w) => {
        return w.id === wayId
      })

      // right now index is always the same no matter where on a linestring the node is added
      console.log('index', index)
      console.log('way', way)
      console.log('sharedWays', sharedWays)
      console.log('node.properties', node.properties)
    }

    dispatch({
      type: types.WAY_EDIT_ADD_NODE,
      node,
      index,
      modifiedSharedWays
    })
  }
}

export function moveSelectedNode (node, coordinates) {
  return (dispatch, getState) => {
    // if the node has other ways that it is a member of
    // find those ways from the state, and dispatch edit on that way as well
    if (node.properties.ways) {
      const sharedWays = getFeaturesFromState(getState(), Object.keys(node.properties.ways))
      if (sharedWays.length) {
        const { modifiedSharedWays } = modifySharedWays(sharedWays, node, coordinates, 'MOVE')
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
    if (node.properties.ways) {
      const sharedWays = getFeaturesFromState(getState(), Object.keys(node.properties.ways))
      if (sharedWays.length) {
        const { modifiedSharedWays } = modifySharedWays(sharedWays, node, null, 'DELETE')
      }
    }

    dispatch({
      type: types.WAY_EDIT_DELETE_NODE,
      node,
      modifiedSharedWays
    })
  }
}
