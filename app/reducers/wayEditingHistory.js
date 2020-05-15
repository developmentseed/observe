import * as types from '../actions/actionTypes'
import undoable from './undoable'
import _cloneDeep from 'lodash.clonedeep'

function wayEditingHistory (state = {
  way: undefined,
  addedNodes: [],
  movedNodes: [],
  deletedNodes: [],
  modifiedSharedWays: []
}, action) {
  switch (action.type) {
    case types.WAY_EDIT_ENTER: {
      const { way } = action
      console.log('way being edited', way)
      return {
        ...state,
        way
      }
    }

    case types.WAY_EDIT_MOVE_NODE: {
      const { way } = state
      const { node, coordinates, modifiedSharedWays } = action
      const newWay = _cloneDeep(way)
      newWay.nodes = way.nodes.map((feature) => {
        const newFeature = _cloneDeep(feature)

        if (node.properties.id === feature.properties.id) {
          newFeature.geometry.coordinates = coordinates
        }

        return newFeature
      })

      // newWay = {
      //   nodes: way.nodes.map((feature) => {
      //     const newFeature = _cloneDeep(feature)

      //     if (node.properties.id === feature.properties.id) {
      //       newFeature.geometry.coordinates = coordinates
      //     }

      //     return newFeature
      //   })
      // }

      const movedNodes = [...state.movedNodes, node.properties.id]

      return {
        ...state,
        way: newWay,
        modifiedSharedWays: modifiedSharedWays || state.modifiedSharedWays,
        movedNodes
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

      const addedNodes = [...state.addedNodes, node.properties.id]

      return {
        ...state,
        way: newWay,
        modifiedSharedWays: modifiedSharedWays || state.modifiedSharedWays,
        addedNodes
      }
    }

    case types.WAY_EDIT_DELETE_NODE: {
      const { way } = state
      const { node, modifiedSharedWays } = action
      const newWay = _cloneDeep(way)
      newWay.nodes = newWay.nodes.filter((feature) => {
        return node.properties.id !== feature.properties.id
      })

      const deletedNodes = [...state.deletedNodes, node.properties.id]

      return {
        ...state,
        way: newWay,
        modifiedSharedWays: modifiedSharedWays || state.modifiedSharedWays,
        deletedNodes
      }
    }
  }

  return state
}

const undoableWayEditingHistory = undoable(wayEditingHistory)

export default undoableWayEditingHistory
