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

export function editWayEnter (feature) {
  let way = null

  // The following block is executed when editing a existing feature.
  // It adds its member notes to the state, allowing their selection on click.
  if (feature) {
    const {
      properties: { ndrefs },
      geometry: { coordinates, type }
    } = feature

    const nodesCoordinates = type === 'Polygon' ? coordinates[0] : coordinates

    // Get nodes from line/polygon to allow node selection
    const nodes = nodesCoordinates.map((coords, i) => {
      const id = `node/${ndrefs[i]}`
      return {
        id,
        type: 'Feature',
        properties: {
          id
        },
        geometry: {
          type: 'Point',
          coordinates: coords
        }
      }
    })

    way = { nodes }
  }

  return {
    type: types.WAY_EDIT_ENTER,
    feature,
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
