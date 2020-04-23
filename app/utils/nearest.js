/**
 * Find all nearest features from a given node
 */
import turfPointToLineDistance from '@turf/point-to-line-distance'
import turfDistance from '@turf/distance'
import { lineString } from '@turf/helpers'

export function findNearest (node, features) {
  const threshold = 0.02
  const nearestEdges = []
  const nearestNodes = []
  features.features.forEach(feature => {
    if (feature.geometry.type === 'LineString') {
      const distance = turfPointToLineDistance(node, feature, { 'units': 'kilometers' })
      if (distance < threshold) {
        feature.properties['distance'] = distance
        nearestEdges.push(feature)
      }
    }

    if (feature.geometry.type === 'Point') {
      const distance = turfDistance(node, feature, { 'units': 'kilometers' })
      if (distance < threshold) {
        nearestNodes.push(feature)
      }
    }

    if (feature.geometry.type === 'Polygon') {
      // get all the edges
      const edges = getEdge(feature)
      edges.forEach(edge => {
        const distance = turfPointToLineDistance(node, edge, { 'units': 'kilometers' })
        if (distance < threshold) {
          nearestEdges.push(edge)
        }
      })
    }
  })
  return {
    nearestEdges,
    nearestNodes
  }
}

function getEdge (polygon) {
  const edges = []
  const length = polygon.geometry.coordinates[0].length
  for (let index = 0; index < length - 1; index++) {
    const edge = polygon.geometry.coordinates[0].slice(index, index + 2)
    const edgeLine = lineString(edge, {})
    edges.push(edgeLine)
  }
  return edges
}
