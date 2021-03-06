/**
 * Find all nearest features from a given node
 */
import turfPointToLineDistance from '@turf/point-to-line-distance'
import turfDistance from '@turf/distance'
import turfNearestPointOnLine from '@turf/nearest-point-on-line'
import { lineString, featureCollection } from '@turf/helpers'
import { nodesGeojson } from '../utils/nodes-to-geojson'
import _sortBy from 'lodash.sortby'
import getRandomId from './get-random-id'
import _find from 'lodash.find'

// FIXME: adjust these based on interactions
const threshold = 0.0005
const nodeThreshold = 0.0005

export async function findNearest (node, features, edits = []) {
  let nearestFeatures = []
  for (const index in features.features) {
    const feature = features.features[index]
    if (feature.geometry.type === 'Point') {
      const distance = turfDistance(node, feature, { 'units': 'kilometers' })
      if (distance < nodeThreshold) {
        feature.properties.distance = distance
        nearestFeatures.push(feature)
      }
    }

    if (feature.geometry.type === 'LineString') {
      const distance = turfPointToLineDistance(node, feature, { 'units': 'kilometers' })
      if (distance < threshold) {
        feature.properties['distance'] = distance
        nearestFeatures.push(feature)
      }
    }

    if (feature.geometry.type === 'Polygon') {
      // get all the edges
      const edges = getEdge(feature)
      edges.forEach(edge => {
        const distance = turfPointToLineDistance(node, edge, { 'units': 'kilometers' })
        if (distance < threshold) {
          edge.properties.parent_feature = feature
          edge.properties.distance = distance
          nearestFeatures.push(edge)
        }
      })
    }
  }

  nearestFeatures = _sortBy(nearestFeatures, 'properties.distance')

  // find the closest node or a point
  const closestFeature = nearestFeatures[0]
  let memberNodes = null

  const results = {
    nearestEdge: null,
    nearestNode: null
  }

  if (closestFeature && closestFeature.geometry.type === 'Point') {
    results.nearestNode = closestFeature
  }

  if (closestFeature && closestFeature.geometry.type === 'LineString') {
    if (closestFeature.properties.hasOwnProperty('parent_feature')) {
      memberNodes = await getNodes(closestFeature.properties.parent_feature, edits)
    } else {
      memberNodes = await getNodes(closestFeature, edits)
    }
    results.nearestEdge = closestFeature
    results.nearestNode = getNearbyMemberNodes(node, memberNodes)
    if (!results.nearestNode) {
      results.nearestNode = findNearestPoint(node, closestFeature)
    }
  }

  return results
}

export function findNearestPoint (node, edge) {
  const point = turfNearestPointOnLine(edge, node, { 'units': 'kilometers' })
  point.properties.id = getRandomId()
  // add a member property to style this node differently
  point.properties.membership = 'no'
  point.properties.edge = edge
  point.properties.ways = {}
  if (edge.properties.hasOwnProperty('parent_feature')) {
    const wayId = edge.properties.parent_feature.properties.id.startsWith('way') ? edge.properties.parent_feature.properties.id.split('/')[1] : edge.properties.parent_feature.properties.id
    point.properties.ways[wayId] = null
  } else {
    const wayId = edge.properties.id.startsWith('way') ? edge.properties.id.split('/')[1] : edge.properties.id
    point.properties.ways = {}
    point.properties.ways[wayId] = null
  }
  return point
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

async function getNodes (feature, edits) {
  let geojson = featureCollection([])
  // if this feature is not yet uploaded
  // fetch member nodes from within the feature props
  if (feature.properties.id.split('/')[1].startsWith('observe')) {
    const nodeCollection = feature.wayEditingHistory.way.nodes
    feature.properties.ndrefs.forEach(nd => {
      const thisNode = _find(nodeCollection, (node) => {
        return node.properties.id === nd
      })
      if (thisNode) geojson.features.push(thisNode)
    })
  } else {
    // get all nodes of this way
    const nodeIds = feature.properties.ndrefs.map(n => {
      return `node/${n}`
    })
    geojson = await nodesGeojson(nodeIds, edits)
  }

  return geojson
}

function getNearbyMemberNodes (point, nodes) {
  let nearbyNodes = []
  nodes.features.forEach(node => {
    const distance = turfDistance(point, node)
    node.properties.distance = distance
    if (distance < nodeThreshold) {
      nearbyNodes.push(node)
    }
  })
  if (nearbyNodes.length) {
    nearbyNodes = _sortBy(nearbyNodes, 'properties.distance')
    return nearbyNodes[0]
  } else {
    return null
  }
}
