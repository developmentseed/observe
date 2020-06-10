import * as types from './actionTypes'
import { findNearest } from '../utils/nearest'
import { getVisibleFeatures } from '../selectors'
import { featureCollection } from '@turf/helpers'
import { nodesGeojson } from '../utils/nodes-to-geojson'
import { isWayPendingUpload } from '../utils/utils'
import _cloneDeep from 'lodash.clonedeep'

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
    let wayEditingHistory = null

    // The following block is executed when editing a existing feature.
    // It adds its member notes to the state, allowing their selection on click.
    if (feature) {
      if (isWayPendingUpload(feature)) {
        // this way is pending upload
        // so fetch nodes from the way members instead of the nodecache
        const { edit } = getState()
        const thisFeatureEdit = edit.edits.find(e => e.id === feature.properties.id)
        const nodes = _cloneDeep(thisFeatureEdit.newFeature.wayEditingHistory.way.nodes)
        way = {
          nodes: nodes,
          properties: { ...feature.properties },
          geometry: { ...feature.geometry }
        }

        wayEditingHistory = thisFeatureEdit.newFeature.wayEditingHistory
      } else {
        const nodeIds = feature.properties.ndrefs.map(n => {
          return `node/${n}`
        })

        // Fetch member nodes from the nodecache
        const { edits } = getState().edit
        const nodes = await nodesGeojson(nodeIds, edits)
        way = {
          nodes: nodes.features,
          properties: { ...feature.properties },
          geometry: { ...feature.geometry }
        }
      }
    }
    dispatch({
      type: types.WAY_EDIT_ENTER,
      feature,
      way,
      wayEditingHistory
    })
  }
}

export function findNearestFeatures (node) {
  return async (dispatch, getState) => {
    const { present } = getState().wayEditingHistory
    const { edits } = getState().edit
    let nearest = null
    if (present.way && present.way.nodes) {
      const wayNodes = featureCollection(present.way.nodes)
      nearest = await findNearest(node, wayNodes, edits)
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
      nearest = await findNearest(node, visibleFeatures, edits)
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
