import getRandomId from '../utils/get-random-id'

export default function createWayFeature (nodes = [], properties = {}, options = {}) {
  // QUESTION: coordinates here are an array of features. So we should probably turn that into geometry coordinates
  // to create the way feature.
  // So do we also create the current state of the edited way?

  if (!properties.ndrefs) {
    properties.ndrefs = []
  }

  if (!options.id) {
    options.id = getRandomId()
  }

  // coordinates = map the nodes into coords
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
