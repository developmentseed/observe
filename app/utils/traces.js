import turfLength from '@turf/length'

/**
 * Returns an empty trace object
 */
export function getNewTrace () {
  return {
    type: 'Feature',
    properties: {
      timestamps: [],
      accuracies: []
    },
    geometry: {
      type: 'LineString',
      coordinates: []
    }
  }
}

/**
 * Takes a point emitted by the location watcher and the current GeoJSON
 * And returns a new GeoJSON object with the point added
 * @param {Object} location - location object returned from expo watchCurrentPosition
 * @param {Object<GeoJSON Feature>} currentTrace - current trace geojson
 */
export function getPoint (location, currentTrace) {
  const obj = location.coords
  return {
    ...currentTrace,
    properties: {
      ...currentTrace.properties,
      timestamps: [
        ...currentTrace.properties.timestamps,
        obj.timestamp
      ],
      accuracies: [
        ...currentTrace.properties.accuracies,
        obj.accuracy
      ]
    },
    geometry: {
      ...currentTrace.geometry,
      coordinates: [
        ...currentTrace.geometry.coordinates,
        [
          obj.longitude,
          obj.latitude
        ]
      ]
    }
  }
}

/**
 * Accepts a trace as a GeoJSON feature and checks for validity
 * @param {Object<GeoJSON Feature>} traceGeoJSON
 * @param {Object} options
 * @param {Number} options.minTraceLength - mininimum number of points for a valid trace
 * @param {Number} options.minTraceDistance - minimum distance of trace (in metres)
 * @returns {Boolean}
 */
export function isValidTrace (traceGeoJSON, options) {
  const defaults = {
    minTraceLength: 3,
    minTraceDistance: 50
  }
  const opts = Object.assign({}, defaults, options)
  const numPoints = traceGeoJSON.geometry.coordinates.length
  if (numPoints < opts.minTraceLength) return false
  const length = getTraceLength(traceGeoJSON)
  if (length < opts.minTraceDistance) return false
  return true
}

/**
 * Accepts a LineString GeoJSON and returns the length, in meters
 * @param {Object<GeoJSON Feature>} traceGeoJSON
 */
export function getTraceLength (traceGeoJSON) {
  return turfLength(traceGeoJSON, { units: 'kilometers' }) * 1000
}
