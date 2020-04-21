import * as types from '../actions/actionTypes'
import undoable from './undoable'

function wayEditingHistory (state = {}, action) {
  switch (action.type) {
    case types.WAY_EDIT_MOVE_NODE: {
      const { way } = state
      return {
        way: { ...way }
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

      return {
        way: { ...way }
      }
    }
  }

  return state
}

const undoableWayEditingHistory = undoable(wayEditingHistory)

export default undoableWayEditingHistory
