import * as types from './actionTypes'
import { getFeaturesFromState } from '../selectors'
import _cloneDeep from 'lodash.clonedeep'

export function addNode (node) {
  return {
    type: types.WAY_EDIT_ADD_NODE,
    node
  }
}

export function moveSelectedNode (node, coordinates) {
  return (dispatch, getState) => {
    // if the node has other ways that it is a member of
    // find those ways from the state, and dispatch edit on that way as well
    let modifiedSharedWays
    if (node.properties.ways) {
      const sharedWays = getFeaturesFromState(getState(), Object.keys(node.properties.ways))
      // modify the shared way with the new coordinate
      if (sharedWays.length) {
        modifiedSharedWays = []
        sharedWays.forEach(oldWay => {
          const newWay = _cloneDeep(oldWay)
          const indexOfNodeInWay = node.properties.ways[oldWay.properties.id.split('/')[1]]
          if (newWay.geometry.type === 'LineString') {
            newWay.geometry.coordinates[indexOfNodeInWay] = coordinates
          }

          if (newWay.geometry.type === 'Polygon') {
            newWay.geometry.coordinates[0][indexOfNodeInWay] = coordinates
          }

          modifiedSharedWays.push(newWay)
        })
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

export function deleteSelectedNode (id) {
  return {
    type: types.WAY_EDIT_DELETE_NODE,
    id
  }
}
