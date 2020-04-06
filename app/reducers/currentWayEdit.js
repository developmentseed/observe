import undoable from 'redux-undo'

import * as types from '../actions/actionTypes'

const initialState = {
  past: [],
  present: {
    id: null, // id of way being edited
    nodes: [],
    actions: []
  },
  future: []
}

function currentWayEdit (state = initialState, action) {
  switch (action.type) {
    // receive a `way` and populate the currentWayEdit object
    case types.WAY_EDIT_ENTER: {
      const way = action.way
      // populate nodes
      console.log('way', way)
      return state
    }

    case types.WAY_EDIT_MOVE_NODE: {
      return state
    }

    case types.WAY_EDIT_ADD_NODE: {
      return state
    }

    case types.WAY_EDIT_DELETE_NODE: {
      return state
    }
  }

  return state
}

const undoableCurrentWayEdit = undoable(currentWayEdit)

export default undoableCurrentWayEdit
