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
  properties.id = `way/${options.id}`

  const coordinates = nodes.map((node, index) => {
    // populate ndrefs
    properties.ndrefs.push(node.properties.id)
    if (!node.properties.ways) node.properties.ways = {}
    if (!node.properties.ways.hasOwnProperty(properties.id)) {
      node.properties.ways[options.id] = index
    }
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
