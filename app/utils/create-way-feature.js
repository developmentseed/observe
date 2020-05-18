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

  // TODO: based on the nodes we have to decide whether this is a polyon or not
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
