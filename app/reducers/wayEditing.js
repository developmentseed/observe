import * as types from '../actions/actionTypes'

function wayEditing (state = {}, action) {
  switch (action.type) {
    // receive a `way` and populate the currentWayEdit object
    case types.WAY_EDIT_ENTER: {
      const way = action.way

      return {
        mode: state.mode,
        way: { ...way }
      }
    }

    case types.WAY_SET_SELECTED_NODE: {
      const { node } = action
      console.log('node', node)
      return {
        selectedNode: node,
        mode: state.mode,
        way: state.way
      }
    }

    case types.WAY_EDIT_MODE_ADD: {
      return {
        mode: 'add',
        way: state.way
      }
    }
  }

  return state
}

export default wayEditing
