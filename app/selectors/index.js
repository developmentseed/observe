import { createSelector } from 'reselect'
import _flatten from 'lodash.flatten'
import fromEntries from 'fromentries'
import bboxPolygon from '@turf/bbox-polygon'
import booleanIntersects from '@turf/boolean-intersects'
import { featureCollection } from '@turf/helpers'

import { addIconUrl } from '../utils/add-icon-url'
import { bboxToTiles } from '../utils/bbox'
import {
  getTraceLength
} from '../utils/traces'
import cache from '../utils/data-cache'
import { filterTags } from '../utils/filter-tags'
import _find from 'lodash.find'

export const getVisibleBounds = state => state.map.visibleBounds
export const getZoom = state => state.map.zoom
const getIntegerZoom = state =>
  state.map.zoom != null ? Math.floor(state.map.zoom) : state.map.zoom

// quantize bounds to prevent excessive filtering when panning around limited
// areas with large numbers of features
const getQuantizedBounds = createSelector(
  getVisibleBounds,
  visibleBounds => {
    if (visibleBounds != null) {
      // visible bounds is [[maxX, maxY], [minX, minY]]
      const width = visibleBounds[0][0] - visibleBounds[1][0]
      const height = visibleBounds[0][1] - visibleBounds[1][1]

      // expand by 50% in each direction
      let minX = visibleBounds[1][0] - width / 2
      let maxX = visibleBounds[0][0] + width / 2
      let minY = visibleBounds[1][1] - height / 2
      let maxY = visibleBounds[0][1] + height / 2

      // truncate to 3 decimal places and round
      minX = Math.floor(minX * 200) / 200
      maxX = Math.ceil(maxX * 200) / 200
      minY = Math.floor(minY * 200) / 200
      maxY = Math.ceil(maxY * 200) / 200

      // serialize as a string to take advantage of reselect equality checks (===)
      return JSON.stringify([[maxX, maxY], [minX, minY]])
    }
  }
)

const getFetchedTiles = state => state.map.fetchedTiles

const getSerialNumber = state => state.map.serialNumber

export const getVisibleFeatures = createSelector(
  [getQuantizedBounds, getFetchedTiles, getIntegerZoom, getSerialNumber],
  (_visibleBounds, fetchedTiles, zoom, serialNumber) => {
    if (_visibleBounds != null && zoom >= 16) {
      const visibleBounds = JSON.parse(_visibleBounds)
      // determine tile coverage
      const tileKeys = bboxToTiles(visibleBounds)

      // load tiled data (where available)
      const tiles = tileKeys.map(k => fetchedTiles[k]).filter(t => t != null)

      // convert bounds to a polygon for intersection purposes
      const bbox = bboxPolygon(_flatten(visibleBounds))

      // track ids of potentially duplicated features (across tile boundaries)
      const ids = new Set()

      // assemble a list of features intersecting the bounding box
      const visibleFeatures = tiles.reduce((features, { key }) => {
        // load data from an LRU cache to prevent needing to store *all* cached
        // data in memory (in addition to persisting it to disk)
        const data = cache.get(key) || {
          features: []
        }

        const newFeatures = data.features
          // ignore duplicates
          .filter(f => !ids.has(f.id))
          // intersect with the bbox
          .filter(f => booleanIntersects(bbox, f))

        // update the list of feature ids
        newFeatures.forEach(f => ids.add(f.id))

        // in-place append
        features.push(...newFeatures)

        return features
      }, [])

      const filtered = filterTags(featureCollection(visibleFeatures))

      return addIconUrl(filtered)
    }

    // no features; empty FeatureCollection
    return featureCollection([])
  }
)

export const isLoadingData = state => state.map.activeTileRequests.length > 0

export const getOfflineResources = ({ map: { offlineResources } }) =>
  offlineResources

export const getOfflineResourceStatus = createSelector(
  getOfflineResources,
  offlineResources =>
    fromEntries(
      Object.entries(offlineResources).map(([name, resource]) => {
        const { data, mapTiles, satelliteTiles, satellite } = resource

        let percentage = (data.percentage + mapTiles.percentage) / 2
        let tilePercentage = mapTiles.percentage
        let size = data.size + mapTiles.size
        let total = mapTiles.total
        let completed = mapTiles.completed

        if (satellite) {
          percentage =
            (data.percentage +
              mapTiles.percentage +
              satelliteTiles.percentage) /
            3
          tilePercentage = (mapTiles.percentage + satelliteTiles.percentage) / 2
          size += satelliteTiles.size

          if (satelliteTiles.total != null) {
            total += satelliteTiles.total
          }

          completed += satelliteTiles.completed
        }

        return [
          name,
          {
            ...resource,
            percentage,
            dataPercentage: data.percentage,
            tilePercentage,
            size,
            total,
            completed
          }
        ]
      })
    )
)

export const getPendingEviction = state => state.map.pendingEviction

export const getIsTracing = state => !!state.traces.currentTrace

export const getCurrentTraceGeoJSON = state => {
  if (state.traces.currentTrace && state.traces.currentTrace.geometry.coordinates.length > 2) {
    return {
      'type': 'FeatureCollection',
      'features': [ state.traces.currentTrace ]
    }
  } else {
    return {
      'type': 'FeatureCollection',
      'features': []
    }
  }
}

export const getCurrentTraceLength = state => {
  const currentTrace = state.traces.currentTrace
  if (!currentTrace || currentTrace.geometry.coordinates.length < 2) return 0
  return getTraceLength(currentTrace)
}

/**
 *
 * @param {Object} state
 * @returns {String} - one of 'recording', 'paused', 'none'
 */
export const getCurrentTraceStatus = state => {
  const { currentTrace, paused } = state.traces
  if (!currentTrace) return 'none'
  if (paused) return 'paused'
  return 'recording'
}

export const showRecordingHeader = state => {
  const { currentTrace, saving } = state.traces
  if (saving) return false
  if (currentTrace) return true
}

export const getTracesGeojson = state => {
  const traces = state.traces.traces
  const tracesGeojson = {
    'type': 'FeatureCollection',
    'features': []
  }
  traces.map(trace => {
    return tracesGeojson.features.push(trace.geojson)
  })

  return tracesGeojson
}

export const getPhotosGeojson = state => {
  const photos = state.photos.photos
  const photosGeojson = {
    'type': 'FeatureCollection',
    'features': []
  }

  if (photos.length > 0) {
    photos.map(photo => {
      const photoGeojson = {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [
            photo.location.coords.longitude,
            photo.location.coords.latitude
          ]
        },
        'properties': {
          'id': photo.id,
          'type': 'photo',
          'description': photo.description,
          'path': photo.path,
          'timestamp': photo.location.timestamp
        }
      }
      return photosGeojson.features.push(photoGeojson)
    })
  }

  return photosGeojson
}

export const getVisibleTiles = state => {
  if (state.map.visibleBounds) {
    return bboxToTiles(state.map.visibleBounds)
  } else {
    return []
  }
}

export const getNearestGeojson = state => {
  let fc = featureCollection([])
  if (state.wayEditing.nearestFeatures) {
    const { nearestEdge, nearestNode } = state.wayEditing.nearestFeatures
    if (nearestEdge) fc.features.push(nearestEdge)
    if (nearestNode) fc.features.push(nearestNode)
  }
  return fc
}

export const getFeaturesFromState = (state, featureIds) => {
  const features = []
  const geojson = getVisibleFeatures(state)
  featureIds.forEach(fId => {
    const id = fId.startsWith('way') ? fId : `way/${fId}`
    const feature = _find(geojson.features, ['id', id])
    if (feature) features.push(feature)
  })
  return features
}
