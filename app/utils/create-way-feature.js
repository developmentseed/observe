import _isEqual from 'lodash.isequal'
import getRandomId from '../utils/get-random-id'

export default function createWayFeature (nodes = [], properties = {}, options = {}) {
  if (!properties.ndrefs) {
    properties.ndrefs = []
  }

  if (!options.id) {
    options.id = getRandomId()
  }

  const coordinates = nodes.map((node) => {
    // populate ndrefs
    properties.ndrefs.push(node.properties.id)
    return node.geometry.coordinates
  })

  let geometryType = (!!nodes.length && _isEqual(nodes[0], nodes[nodes.length - 1])) ? 'Polygon' : 'LineString'

  properties.id = `way/${options.id}`
  return {
    type: 'Feature',
    id: `way/${options.id}`,
    properties,
    geometry: {
      type: geometryType,
      coordinates
    }
  }
}
