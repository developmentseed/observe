import { getNodes } from '../services/nodecache'

export async function nodesGeojson (nodeIds) {
  const nodes = await getNodes(nodeIds)
  const geojson = {
    'type': 'FeatureCollection',
    'features': []
  }

  Object.keys(nodes).forEach(id => {
    const feature = {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [parseFloat(nodes[id].lon), parseFloat(nodes[id].lat)]
      },
      'properties': {}
    }
    geojson.features.push(feature)
  })
  return Promise.resolve(geojson)
}
