import * as types from './actionTypes'
import { findNearest } from '../utils/nearest'
import { getVisibleFeatures } from '../selectors'
import { featureCollection } from '@turf/helpers'
import { nodesGeojson } from '../utils/nodes-to-geojson'

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
  return async (dispatch, getState) => {
    let way = null

    // The following block is executed when editing a existing feature.
    // It adds its member notes to the state, allowing their selection on click.
    if (feature) {
      // Get nodes from line/polygon to allow node selection
      const nodeIds = feature.properties.ndrefs.map(n => {
        return `node/${n}`
      })

      // Fetch member nodes from the nodecache
      const nodes = await nodesGeojson(nodeIds)
      way = {
        nodes: nodes.features,
        properties: { ...feature.properties },
        geometry: { ...feature.geometry }
      }
    }
    dispatch({
      type: types.WAY_EDIT_ENTER,
      feature,
      way
    })
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
      const mapFeatures = getVisibleFeatures(getState())
      const pendingFeatures = getState().edit.editsGeojson
      let visibleFeatures
      if (pendingFeatures.features.length) {
        visibleFeatures = featureCollection(mapFeatures.features.concat(pendingFeatures.features))
      } else {
        visibleFeatures = featureCollection(mapFeatures.features)
      }
      nearest = await findNearest(node, visibleFeatures)
    }

    dispatch({
      type: types.FIND_NEAREST_FEATURES,
      nearest
    })
  }
}

export function resetWayEditing () {
  return {
    type: types.RESET_WAY_EDITING
  }
}
