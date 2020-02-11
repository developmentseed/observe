import * as types from '../actions/actionTypes'
import { statement } from '@babel/template'

const initialState = {
  id: null, // id of way being edited
  nodes: [],
  actions: []
}

export default function(state = initialState, action) {
  switch (action.type) {

    // receive a `way` and populate the currentWayEdit object
    case types.WAY_EDIT_ENTER: {
      const way = action.way
      // populate nodes
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
} 