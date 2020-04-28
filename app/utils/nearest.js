/**
 * Find all nearest features from a given node
 */
import turfPointToLineDistance from '@turf/point-to-line-distance'
import turfDistance from '@turf/distance'
import turfNearestPointOnLine from '@turf/nearest-point-on-line'
import { lineString } from '@turf/helpers'
import { nodesGeojson } from '../utils/nodes-to-geojson'

// FIXME: adjust these based on interactions
const threshold = 0.01
const nodeThreshold = 0.02

export async function findNearest (node, features) {
  const nearestEdges = []
  let nearestNodes = []
  for (const index in features.features) {
    const feature = features.features[index]

    if (feature.geometry.type === 'Point') {
      const distance = turfDistance(node, feature, { 'units': 'kilometers' })
      if (distance < threshold) {
        feature.properties.distance = distance
        nearestNodes.push(feature)
      }
    }

    if (feature.geometry.type === 'LineString') {
      const nodes = await getNodes(feature)
      const distance = turfPointToLineDistance(node, feature, { 'units': 'kilometers' })
      if (distance < threshold) {
        feature.properties['distance'] = distance
        nearestEdges.push(feature)
        // check if there are nearby member nodes
        const nearbyNodes = getNearbyMemberNodes(node, nodes)
        if (nearbyNodes.length) {
          nearestNodes = nearestNodes.concat(nearbyNodes)
        }
      }
    }

    if (feature.geometry.type === 'Polygon') {
      // get all the edges
      const edges = getEdge(feature)
      const nodes = await getNodes(feature)
      edges.forEach(edge => {
        const distance = turfPointToLineDistance(node, edge, { 'units': 'kilometers' })
        if (distance < threshold) {
          edge.properties.parent_id = feature.properties.id
          edge.properties.distance = distance
          nearestEdges.push(edge)
          const nearbyNodes = getNearbyMemberNodes(node, nodes)
          if (nearbyNodes.length) {
            nearestNodes = nearestNodes.concat(nearbyNodes)
          }
        }
      })
    }
  }

  return {
    nearestEdges,
    nearestNodes
  }
}

export function findNearestPoint (node, edge) {
  return turfNearestPointOnLine(edge, node, { 'units': 'kilometers' })
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

async function getNodes (feature) {
  // get all nodes of this way
  const nodeIds = feature.properties.ndrefs.map(n => {
    return `node/${n}`
  })
  const geojson = await nodesGeojson(nodeIds)
  return geojson
}

function getNearbyMemberNodes (point, nodes) {
  const nearbyNodes = []
  nodes.features.forEach(node => {
    const distance = turfDistance(point, node)
    if (distance < nodeThreshold) {
      nearbyNodes.push(node)
    }
  })
  return nearbyNodes
}
