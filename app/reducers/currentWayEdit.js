import undoable from 'redux-undo/lib/index'

import * as types from '../actions/actionTypes'

const initialState = {
  mode: null,
  way: {
    id: null, // id of way being edited
    nodes: []
  }
}

function currentWayEdit (state = initialState, action) {
  console.log('action', action.type, state)
  switch (action.type) {
    // receive a `way` and populate the currentWayEdit object
    case types.WAY_EDIT_ENTER: {
      const way = action.way
      // populate nodes
      console.log('way', way)
      return {
        mode: state.mode,
        way: { ...way }
      }
    }

    case types.WAY_EDIT_MOVE_NODE: {
      return {
        mode: state.mode,
        way: { ...way }
      }
    }

    case types.WAY_EDIT_ADD_NODE: {
      const { node } = action
      const { way } = state

      way.nodes = [...way.nodes, node]

      console.log('way', way)
      return {
        mode: state.mode,
        way: { ...way }
      }
    }

    case types.WAY_EDIT_DELETE_NODE: {
      return {
        mode: state.mode,
        way: { ...way }
      }
    }

    case types.WAY_EDIT_MODE_ADD: {
      console.log('state', state)
      return {
        mode: 'add',
        way: state.way
      }
    }
  }

  return state
}

const undoableCurrentWayEdit = undoable(currentWayEdit)

export default undoableCurrentWayEdit
