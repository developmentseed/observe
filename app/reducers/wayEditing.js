import * as types from '../actions/actionTypes'

function wayEditing (state = {}, action) {
  switch (action.type) {
    // receive a `way` and populate the currentWayEdit object
    case types.WAY_EDIT_ENTER: {
      const { feature, way } = action
      return {
        mode: state.mode,
        way,
        feature
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

    case types.FIND_NEAREST_FEATURES: {
      return {
        ...state,
        nearestFeatures: action.nearest
      }
    }

    case types.RESET_WAY_EDITING: {
      return {}
    }
  }

  return state
}

export default wayEditing
