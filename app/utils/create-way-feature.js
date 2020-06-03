import getRandomId from '../utils/get-random-id'

export default function createWayFeature (nodes = [], properties = {}, options = {}) {
  if (!properties.ndrefs) {
    properties.ndrefs = []
  }

  if (!options.id) {
    options.id = getRandomId()
  }
  properties.id = options.id

  const coordinates = nodes.map((node, index) => {
    // populate ndrefs
    properties.ndrefs.push(node.properties.id)
    if (!node.properties.ways) node.properties.ways = {}
    if (!node.properties.ways.hasOwnProperty(properties.id)) {
      node.properties.ways[properties.id] = index
    }
    return node.geometry.coordinates
  })

  properties.id = `way/${options.id}`
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
