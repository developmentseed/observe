import * as types from '../actions/actionTypes'
import undoable from './undoable'

function wayEditingHistory (state = {}, action) {
  switch (action.type) {
    case types.WAY_EDIT_MOVE_NODE: {
      const { way } = state
      const { id, coordinates } = action

      const newWay = {
        nodes: way.nodes.map((feature) => {
          const newFeature = {
            id: feature.id,
            type: feature.type,
            properties: {
              id: feature.id
            }
          }

          if (id === feature.id) {
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
        way: newWay
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
        way: newWay
      }
    }

    case types.WAY_EDIT_DELETE_NODE: {
      const { way } = state
      const { id } = action

      const newWay = {
        nodes: way.nodes.filter((feature) => {
          return id !== feature.id
        })
      }

      return {
        way: newWay
      }
    }
  }

  return state
}

const undoableWayEditingHistory = undoable(wayEditingHistory)

export default undoableWayEditingHistory
