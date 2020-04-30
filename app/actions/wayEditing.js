import * as types from './actionTypes'
import { findNearest } from '../utils/nearest'
import { getVisibleFeatures } from '../selectors'

export function setWayEditingMode (mode) {
  return {
    type: types.WAY_EDIT_MODE_ADD
  }
}

export function setSelectedNode (node) {
  return {
    type: types.WAY_SET_SELECTED_NODE,
    node
  }
}

export function editWayEnter (way) {
  return {
    type: types.WAY_EDIT_ENTER,
    way
  }
}

export function findNearestFeatures (node) {
  return async (dispatch, getState) => {
    const geojson = getVisibleFeatures(getState())
    const nearest = await findNearest(node, geojson)
    dispatch({
      type: types.FIND_NEAREST_FEATURES,
      nearest
    })
  }
}
