import * as types from '../actions/actionTypes'
import undoable from './undoable'
import _cloneDeep from 'lodash.clonedeep'
import _findIndex from 'lodash.findindex'

function createDefaultState () {
  return {
    way: undefined,
    addedNodes: [],
    movedNodes: [],
    deletedNodes: [],
    mergedNodes: [],
    modifiedSharedWays: []
  }
}

function wayEditingHistory (state = createDefaultState(), action) {
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

      const newNodes = [ ...way.nodes ]
      const newWay = { ...way }

      // Don't use way.nodes to generate the geometry because they are coming
      // from the nodecache and duplicate nodes are represented only once
      // for example a polygon

      // So we'll just push the new node
      newWay.nodes = [...newNodes, node]

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
      // newWay.nodes = newWay.nodes.filter((feature) => {
      //   return node.properties.id !== feature.properties.id
      // })

      const deletedNodes = [...state.deletedNodes, node.properties.id]

      return {
        ...state,
        way: newWay,
        modifiedSharedWays: modifiedSharedWays || state.modifiedSharedWays,
        deletedNodes
      }
    }

    case types.RESET_WAY_EDITING: {
      return createDefaultState()
    }

    case types.WAY_EDIT_MERGE_NODE: {
      const { way } = state
      const { sourceNode, destinationNode, modifiedSharedWays } = action

      console.log('sourceNode', sourceNode)
      console.log('destinationNode', destinationNode)

      const newWay = _cloneDeep(way)

      const indexOfSourceNode = _findIndex(newWay.nodes, (feature) => {
        return feature.properties.id === sourceNode.properties.id
      })

      // replace the sourceNode in way.nodes
      newWay.nodes.splice(indexOfSourceNode, 1, destinationNode)
      const mergedNodes = [...state.mergedNodes, destinationNode.properties.id]

      return {
        ...state,
        way: newWay,
        modifiedSharedWays: modifiedSharedWays || state.modifiedSharedWays,
        mergedNodes
      }
    }
  }

  return state
}

const undoableWayEditingHistory = undoable(wayEditingHistory)

export default undoableWayEditingHistory
