import * as types from '../actions/actionTypes'
import undoable from './undoable'

function wayEditingHistory (state = {
  way: undefined,
  modifiedSharedWays: []
}, action) {
  switch (action.type) {
    case types.WAY_EDIT_MOVE_NODE: {
      const { way } = state
      const { node, coordinates, modifiedSharedWays } = action

      const newWay = {
        nodes: way.nodes.map((feature) => {
          const newFeature = {
            id: feature.id,
            type: feature.type,
            properties: {
              id: feature.id
            }
          }

          if (node.id === feature.id) {
            newFeature.geometry = {
              type: feature.geometry.type,
              coordinates
            }
          } else {
            newFeature.geometry = feature.geometry
          }

          return newFeature
        })
      }

      return {
        ...state,
        way: newWay,
        modifiedSharedWays: modifiedSharedWays || state.modifiedSharedWays
      }
    }

    case types.WAY_EDIT_ADD_NODE: {
      const { node } = action
      let { way } = state

      if (!way) {
        way = {
          nodes: []
        }
      }

      const oldNodes = way.nodes
      const newWay = { ...way }

      newWay.nodes = [...oldNodes, node]

      return {
        ...state,
        way: newWay
      }
    }

    case types.WAY_EDIT_DELETE_NODE: {
      const { way } = state
      const { node, modifiedSharedWays } = action

      const newWay = {
        nodes: way.nodes.filter((feature) => {
          return node.id !== feature.id
        })
      }

      return {
        ...state,
        way: newWay,
        modifiedSharedWays: modifiedSharedWays || state.modifiedSharedWays
      }
    }
  }

  return state
}

const undoableWayEditingHistory = undoable(wayEditingHistory)

export default undoableWayEditingHistory
