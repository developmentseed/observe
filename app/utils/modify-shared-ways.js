import _cloneDeep from 'lodash.clonedeep'
import _findIndex from 'lodash.findindex'
import _isEqual from 'lodash.isequal'

export default function modifySharedWays (sharedWays, node, coordinates, action) {
  let modifiedSharedWays = []
  let index

  switch (action) {
    case 'MOVE':
      sharedWays.forEach(oldWay => {
        const newWay = _cloneDeep(oldWay)
        const indexOfNodeInWay = node.properties.ways[oldWay.properties.id.split('/')[1]] || node.properties.ways[oldWay.properties.id]
        if (newWay.geometry.type === 'LineString') {
          newWay.geometry.coordinates[indexOfNodeInWay] = coordinates
        }

        if (newWay.geometry.type === 'Polygon') {
          newWay.geometry.coordinates[0][indexOfNodeInWay] = coordinates
        }

        if (!newWay.properties.movedNodes) {
          newWay.properties.movedNodes = []
        }

        if (!newWay.properties.movedNodes.includes(node.properties.id)) {
          newWay.properties.movedNodes.push(node.properties.id)
        }

        modifiedSharedWays.push(newWay)
      })
      break

    case 'DELETE':
      sharedWays.forEach(oldWay => {
        const newWay = _cloneDeep(oldWay)
        const indexOfNodeInWay = node.properties.ways[oldWay.properties.id.split('/')[1]] || node.properties.ways[oldWay.properties.id]
        if (newWay.geometry.type === 'LineString') {
          newWay.geometry.coordinates.splice(indexOfNodeInWay, 1)
        }

        if (newWay.geometry.type === 'Polygon') {
          newWay.geometry.coordinates[0].splice(indexOfNodeInWay, 1)
        }

        if (!newWay.properties.deletedNodes) {
          newWay.properties.deletedNodes = []
        }

        if (!newWay.properties.deletedNodes.includes(node.properties.id)) {
          newWay.properties.deletedNodes.push(node.properties.id)
        }

        modifiedSharedWays.push(newWay)
      })
      break

    case 'ADD':
      if (node.properties.edge) {
        const indexOfPointOnEdge = node.properties.index

        // QUESTION
        // it seems like pointOnEdgeAtIndex is always the same
        // i'm not sure if that's because indexOfPointOnEdge is supposed to be the same each time?
        const pointOnEdgeAtIndex = node.properties.edge.geometry.coordinates[indexOfPointOnEdge]
        console.log('pointOnEdgeAtIndex', pointOnEdgeAtIndex)
        sharedWays.forEach(oldWay => {
          const newWay = _cloneDeep(oldWay)
          // find the index of this point on the way
          if (oldWay.geometry.type === 'LineString') {
            const indexOfNearestPoint = _findIndex(newWay.geometry.coordinates, (c) => {
              return _isEqual(c, pointOnEdgeAtIndex)
            })
            console.log('indexOfNearestPoint', indexOfNearestPoint)
            newWay.geometry.coordinates.splice(indexOfNearestPoint + 1, 0, node.geometry.coordinates)

            // add this way membership to the node
            node.properties.ways = { ...node.properties.ways }
            node.properties.ways[newWay.properties.id] = indexOfNearestPoint + 1

            // add this node to the way ndrefs
            newWay.properties.ndrefs.splice(indexOfNearestPoint + 1, 0, node.properties.id)

            index = indexOfNearestPoint + 1
          }

          if (oldWay.geometry.type === 'Polygon') {
            const indexOfNearestPoint = _findIndex(newWay.geometry.coordinates[0], (c) => {
              return _isEqual(c, pointOnEdgeAtIndex)
            })
            newWay.geometry.coordinates[0].splice(indexOfNearestPoint + 1, 0, node.geometry.coordinates)
            node.properties.ways = { ...node.properties.ways }
            node.properties.ways[newWay.properties.id] = indexOfNearestPoint + 1
            newWay.properties.ndrefs.splice(indexOfNearestPoint + 1, 0, node.properties.id)

            index = indexOfNearestPoint + 1
          }

          if (!newWay.properties.addedNodes) {
            newWay.properties.addedNodes = []
          }

          if (!newWay.properties.addedNodes.includes(node.properties.id)) {
            newWay.properties.addedNodes.push(node.properties.id)
          }

          modifiedSharedWays.push(newWay)
        })
      }
  }
  return { modifiedSharedWays, index }
}
