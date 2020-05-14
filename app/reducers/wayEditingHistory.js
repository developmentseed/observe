import * as types from '../actions/actionTypes'
import undoable from './undoable'
import _cloneDeep from 'lodash.clonedeep'

function wayEditingHistory (state = {
  way: undefined,
  modifiedSharedWays: []
}, action) {
  switch (action.type) {
    case types.WAY_EDIT_ENTER: {
      const { way } = action
      return {
        ...state,
        way
      }
    }

    case types.WAY_EDIT_MOVE_NODE: {
      const { way } = state
      const { node, coordinates, modifiedSharedWays } = action

      const newWay = {
        nodes: way.nodes.map((feature) => {
          const newFeature = _cloneDeep(feature)

          if (node.properties.id === feature.properties.id) {
            newFeature.geometry.coordinates = coordinates
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
      const { node, modifiedSharedWays } = action
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
        way: newWay,
        modifiedSharedWays: modifiedSharedWays || state.modifiedSharedWays
      }
    }

    case types.WAY_EDIT_DELETE_NODE: {
      const { way } = state
      const { node, modifiedSharedWays } = action
      const newWay = _cloneDeep(way)
      newWay.nodes = newWay.nodes.filter((feature) => {
        return node.properties.id !== feature.properties.id
      })

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
