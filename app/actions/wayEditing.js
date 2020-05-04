import * as types from './actionTypes'
import { findNearest } from '../utils/nearest'
import { getVisibleFeatures } from '../selectors'
import { featureCollection } from '@turf/helpers'

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
    const { present } = getState().wayEditingHistory
    let nearest = null
    if (present.way && present.way.nodes) {
      const wayNodes = featureCollection(present.way.nodes)
      nearest = await findNearest(node, wayNodes)
    }

    if (!nearest || !nearest.nearestNode) {
      const visibleFeatures = getVisibleFeatures(getState())
      nearest = await findNearest(node, visibleFeatures)
    }

    dispatch({
      type: types.FIND_NEAREST_FEATURES,
      nearest
    })
  }
}
