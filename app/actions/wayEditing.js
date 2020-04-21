import * as types from './actionTypes'

export function setWayEditingMode (mode) {
  return {
    type: types.WAY_EDIT_MODE_ADD
  }
}

export function setSelectedNode (point) {
  return {
    type: types.WAY_SET_SELECTED_NODE,
    point
  }
}

export function editWayEnter (way) {
  return {
    type: types.WAY_EDIT_ENTER,
    way
  }
}
