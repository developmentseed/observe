import * as types from './actionTypes'

export function addNode (node) {
  return {
    type: types.WAY_EDIT_ADD_NODE,
    node
  }
}

export function moveSelectedNode (id, coordinates) {
  return {
    type: types.WAY_EDIT_MOVE_NODE,
    id,
    coordinates
  }
}

export function deleteSelectedNode (id) {
  return {
    type: types.WAY_EDIT_DELETE_NODE,
    id
  }
}
