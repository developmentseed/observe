import getRandomId from '../utils/get-random-id'

export default function createWayFeature (nodes = [], properties = {}, options = {}) {
  console.log('createway nodes', nodes)

  if (!properties.ndrefs) {
    properties.ndrefs = []
  }

  if (!options.id) {
    options.id = getRandomId()
  }

  const coordinates = []
  if (nodes.length) {
    nodes.forEach(node => {
      coordinates.push(node.geometry.coordinates)
      properties.ndrefs.push(node.properties.id)
    })
    properties.nodes = nodes
  }

  return {
    type: 'Feature',
    id: `way/${options.id}`,
    properties,
    geometry: {
      type: 'LineString',
      coordinates
    }
  }
}
