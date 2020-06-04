import getRandomId from '../utils/get-random-id'
import rewind from '@mapbox/geojson-rewind'
import _isEqual from 'lodash.isequal'

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

  properties.id = `way/${options.id}`

  const feature = {
    type: 'Feature',
    id: `way/${options.id}`,
    properties,
    geometry: {
      type: 'LineString',
      coordinates
    }
  }

  const rewoundFeature = rewind(feature)
  if (!_isEqual(rewoundFeature.geometry.coordinates, feature.geometry.coordinates)) {
    rewoundFeature.properties.ndrefs.reverse()
  }

  return rewoundFeature
}
