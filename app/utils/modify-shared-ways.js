import _cloneDeep from 'lodash.clonedeep'
import _findIndex from 'lodash.findindex'
import _isEqual from 'lodash.isequal'

function moveNode (sharedWays, node, coordinates) {
  let modifiedSharedWays = []
  sharedWays.forEach(oldWay => {
    const newWay = _cloneDeep(oldWay)
    const wayId = oldWay.properties.id.startsWith('way') ? oldWay.properties.id.split('/')[1] : oldWay.properties.id
    const indexOfNodeInWay = node.properties.ways[wayId]

    if (newWay.geometry.type === 'LineString') {
      newWay.geometry.coordinates[indexOfNodeInWay] = coordinates
    }

    if (newWay.geometry.type === 'Polygon') {
      newWay.geometry.coordinates[0][indexOfNodeInWay] = coordinates

      if (indexOfNodeInWay === 0) {
        newWay.geometry.coordinates[0][newWay.geometry.coordinates[0].length - 1] = coordinates
      } else if (indexOfNodeInWay === newWay.geometry.coordinates[0].length - 1) {
        newWay.geometry.coordinates[0][0] = coordinates
      }
    }

    if (typeof newWay.properties.movedNodes === 'string') {
      newWay.properties.movedNodes = [newWay.properties.movedNodes]
    }

    if (!newWay.properties.movedNodes) {
      newWay.properties.movedNodes = []
    }

    if (!newWay.properties.movedNodes.includes(node.properties.id)) {
      newWay.properties.movedNodes.push(node.properties.id)
    }

    modifiedSharedWays.push(newWay)
  })

  return modifiedSharedWays
}

function deleteNode (sharedWays, node) {
  let modifiedSharedWays = []
  sharedWays.forEach(oldWay => {
    const newWay = _cloneDeep(oldWay)
    const wayId = oldWay.properties.id.startsWith('way') ? oldWay.properties.id.split('/')[1] : oldWay.properties.id
    const indexOfNodeInWay = node.properties.ways[wayId]

    if (newWay.geometry.type === 'LineString') {
      newWay.geometry.coordinates.splice(indexOfNodeInWay, 1)
    }

    if (newWay.geometry.type === 'Polygon') {
      newWay.geometry.coordinates[0].splice(indexOfNodeInWay, 1)
    }

    // remove the node from ndrefs
    newWay.properties.ndrefs = newWay.properties.ndrefs.filter(n => {
      return n !== node.properties.id.split('/')[1]
    })

    if (!newWay.properties.deletedNodes) {
      newWay.properties.deletedNodes = []
    }

    if (!newWay.properties.deletedNodes.includes(node.properties.id)) {
      newWay.properties.deletedNodes.push(node.properties.id)
    }

    modifiedSharedWays.push(newWay)
  })
  return modifiedSharedWays
}

function addNode (sharedWays, node) {
  let modifiedSharedWays = []
  if (node.properties.edge) {
    const indexOfPointOnEdge = node.properties.index

    const pointOnEdgeAtIndex = node.properties.edge.geometry.coordinates[indexOfPointOnEdge]
    sharedWays.forEach(oldWay => {
      const newWay = _cloneDeep(oldWay)
      // find the index of this point on the way
      let indexOfNearestPoint
      if (oldWay.geometry.type === 'LineString') {
        indexOfNearestPoint = _findIndex(newWay.geometry.coordinates, (c) => {
          return _isEqual(c, pointOnEdgeAtIndex)
        })
        newWay.geometry.coordinates.splice(indexOfNearestPoint + 1, 0, node.geometry.coordinates)
      }

      if (oldWay.geometry.type === 'Polygon') {
        indexOfNearestPoint = _findIndex(newWay.geometry.coordinates[0], (c) => {
          return _isEqual(c, pointOnEdgeAtIndex)
        })
        newWay.geometry.coordinates[0].splice(indexOfNearestPoint + 1, 0, node.geometry.coordinates)
      }

      // add this way membership to the node
      node.properties.ways = { ...node.properties.ways }
      node.properties.ways[newWay.properties.id] = indexOfNearestPoint + 1

      // add this node to the way ndrefs
      newWay.properties.ndrefs.splice(indexOfNearestPoint + 1, 0, node.properties.id)

      if (!newWay.properties.addedNodes) {
        newWay.properties.addedNodes = []
      }

      if (!newWay.properties.addedNodes.includes(node.properties.id)) {
        newWay.properties.addedNodes.push(node.properties.id)
      }

      modifiedSharedWays.push(newWay)
    })
  }
  return modifiedSharedWays
}

function mergeNode (sharedWays, sourceNode, destinationNode) {
  let modifiedSharedWays = []
  sharedWays.forEach(oldWay => {
    const newWay = _cloneDeep(oldWay)

    let indexOfSourceNode
    if (newWay.geometry.type === 'LineString') {
      indexOfSourceNode = _findIndex(newWay.properties.ndrefs, (r) => {
        return _isEqual(r, sourceNode.properties.id.split('/')[1])
      })
      // update the geometry
      newWay.geometry.coordinates.splice(indexOfSourceNode, 1, destinationNode.geometry.coordinates)
    }

    if (newWay.geometry.type === 'Polygon') {
      indexOfSourceNode = _findIndex(newWay.properties.ndrefs, (r) => {
        return _isEqual(r, sourceNode.properties.id.split('/')[1])
      })
      // update the geometry
      newWay.geometry.coordinates[0].splice(indexOfSourceNode, 1, destinationNode.geometry.coordinates)
    }

    // update the ndrefs of the way
    newWay.properties.ndrefs.splice(indexOfSourceNode, 1, destinationNode.properties.id)

    // add the ways membership for the destinationNode
    destinationNode.properties.ways[newWay.properties.id.split('/')[1]] = indexOfSourceNode

    if (!newWay.properties.mergedNodes) {
      newWay.properties.mergedNodes = []
    }

    newWay.properties.mergedNodes.push({
      sourceNode: sourceNode.properties.id,
      destinationNode: destinationNode.properties.id
    })

    modifiedSharedWays.push(newWay)
  })
  return modifiedSharedWays
}

const modifySharedWays = {
  moveNode,
  deleteNode,
  addNode,
  mergeNode
}

export default modifySharedWays
