import _cloneDeep from 'lodash.clonedeep'

export default function modifySharedWays (sharedWays, node, coordinates, action) {
  let modifiedSharedWays = []
  switch (action) {
    case 'MOVE':
      sharedWays.forEach(oldWay => {
        const newWay = _cloneDeep(oldWay)
        const indexOfNodeInWay = node.properties.ways[oldWay.properties.id.split('/')[1]]
        if (newWay.geometry.type === 'LineString') {
          newWay.geometry.coordinates[indexOfNodeInWay] = coordinates
        }

        if (newWay.geometry.type === 'Polygon') {
          newWay.geometry.coordinates[0][indexOfNodeInWay] = coordinates
        }

        modifiedSharedWays.push(newWay)
      })
      break

    case 'DELETE':
      sharedWays.forEach(oldWay => {
        const newWay = _cloneDeep(oldWay)
        const indexOfNodeInWay = node.properties.ways[oldWay.properties.id.split('/')[1]]
        if (newWay.geometry.type === 'LineString') {
          newWay.geometry.coordinates.splice(indexOfNodeInWay, 1)
        }

        if (newWay.geometry.type === 'Polygon') {
          newWay.geometry.coordinates[0].splice(indexOfNodeInWay, 1)
        }
        modifiedSharedWays.push(newWay)
      })
  }
  return modifiedSharedWays
}
