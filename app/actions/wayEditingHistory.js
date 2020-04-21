import * as types from './actionTypes'

export function addNode (node) {
  return {
    type: types.WAY_EDIT_ADD_NODE,
    node
  }
}

export function moveSelectedNode (node) {
  return {
    type: types.WAY_EDIT_MOVE_NODE,
    node
  }
}

export function deleteSelectedNode (node) {
  return {
    type: types.WAY_EDIT_DELETE_NODE,
    node
  }
}
