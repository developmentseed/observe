import { getNodes } from '../services/nodecache'

export async function nodesGeojson (nodeIds, edits = []) {
  const nodes = await getNodes(nodeIds)
  const realNodes = {}
  if (edits && edits.length) {
    // get all the nodes in the edits
    edits.forEach(edit => {
      if (edit && edit.newFeature && edit.newFeature.wayEditingHistory) {
        edit.newFeature.wayEditingHistory.way.nodes.forEach(nd => {
          realNodes[nd.properties.id] = nd
        })
      }
    })
  }

  const geojson = {
    'type': 'FeatureCollection',
    'features': []
  }

  Object.keys(nodes).forEach(id => {
    let feature
    if (realNodes.hasOwnProperty(id)) {
      feature = realNodes[id]
    } else {
      feature = {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [parseFloat(nodes[id].lon), parseFloat(nodes[id].lat)]
        },
        'properties': {
          'id': id,
          'ways': nodes[id].ways,
          'version': nodes[id].version
        }
      }

      if (nodes[id].tags) {
        feature.properties = Object.assign(feature.properties, nodes[id].tags)
      }
    }

    geojson.features.push(feature)
  })
  return Promise.resolve(geojson)
}
