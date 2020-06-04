import * as types from '../actions/actionTypes'
import undoable from './undoable'
import _cloneDeep from 'lodash.clonedeep'
import { isNewId } from '../utils/utils'

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
      let addedNodes
      let movedNodes
      let deletedNodes
      let mergedNodes
      let modifiedSharedWays
      console.log('way being edited', way)
      if (action.wayEditingHistory) {
        // editing a way that's pending upload

        const wayEditingHistory = _cloneDeep(action.wayEditingHistory)
        addedNodes = wayEditingHistory.addedNodes
        movedNodes = wayEditingHistory.movedNodes
        deletedNodes = wayEditingHistory.deletedNodes
        mergedNodes = wayEditingHistory.mergedNodes
        modifiedSharedWays = wayEditingHistory.modifiedSharedWays
      }
      return {
        ...state,
        way,
        addedNodes: addedNodes || state.addedNodes,
        movedNodes: movedNodes || state.movedNodes,
        deletedNodes: deletedNodes || state.deletedNodes,
        mergedNodes: mergedNodes || state.mergedNodes,
        modifiedSharedWays: modifiedSharedWays || state.modifiedSharedWays
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

      let movedNodes
      if (!isNewId(node.properties.id)) {
        movedNodes = _cloneDeep(state.movedNodes)
        movedNodes.push(node.properties.id)
      }

      return {
        ...state,
        way: newWay,
        modifiedSharedWays: modifiedSharedWays || state.modifiedSharedWays,
        movedNodes: movedNodes || state.movedNodes
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

      const addedNodes = _cloneDeep(state.addedNodes)
      addedNodes.push(node.properties.id)

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

      let deletedNodes
      let addedNodes
      if (!isNewId(node.properties.id)) {
        deletedNodes = _cloneDeep(state.deletedNodes)
        deletedNodes.push(node.properties.id)
      } else {
        // if this is a new node, then remove it from addedNode so we don't create it
        addedNodes = _cloneDeep(state.addedNodes)
        addedNodes = addedNodes.filter(nd => nd !== node.properties.id)
      }

      return {
        ...state,
        way: newWay,
        modifiedSharedWays: modifiedSharedWays || state.modifiedSharedWays,
        deletedNodes: deletedNodes || state.deletedNodes,
        addedNodes: addedNodes || state.addedNodes
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

      let mergedNodes = _cloneDeep(state.mergedNodes)
      // if the source node is a new node, then this pretty much an addNode operation.
      // so no need to say we are merging
      if (!isNewId(sourceNode.properties.id)) {
        mergedNodes.push({
          sourceNode: sourceNode.properties.id,
          destinationNode: destinationNode.properties.id
        })
      }

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
