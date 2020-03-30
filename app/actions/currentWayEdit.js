import * as types from './actionTypes'

export function editWayEnter (way) {
  return {
    type: types.WAY_EDIT_ENTER,
    way
  }
}

export function addWayNode (node) {
  return {
    type: types.WAY_EDIT_ADD_NODE,
    node
  }
}

export function moveWayNode (node) {
  return {
    type: types.WAY_EDIT_MOVE_NODE,
    node
  }
}

export function deleteWayNode (node) {
  return {
    type: types.WAY_EDIT_DELETE_NODE,
    node
  }
}
