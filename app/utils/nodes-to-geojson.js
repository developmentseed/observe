import { getNodes } from '../services/nodecache'

export async function nodesGeojson (nodeIds) {
  const nodes = await getNodes(nodeIds)
  console.log('fetched nodes', nodes)
  const geojson = {
    'type': 'FeatureCollection',
    'features': []
  }

  Object.keys(nodes).forEach(id => {
    const feature = {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [nodes[id].lon, nodes[id].lat]
      }
    }
    geojson.features.push(feature)
  })
  return Promise.resolve(geojson)
}
