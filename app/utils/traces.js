import turfLength from '@turf/length'

/**
 * Returns an empty trace object
 */
export function getNewTrace () {
  return {
    points: []
  }
}

/**
 * Returns a trace point object to store in the state
 * @param {Object} location - location object returned from expo watchCurrentPosition
 */
export function getPoint (location) {
  return { ...location.coords }
}

/**
 *
 * @param {Object} trace - trace object
 * @returns {Object} - TraceJSON representation of trace
 * @example
 * const trace = {
 *   'description': 'some trace',
 *   'points': [
 *     {
 *       'latitude': 1.0,
 *       'longitude': 1.0,
 *       'timestamp': 100
 *     },
 *     {
 *       'latitude': 2.0,
 *       'longitude': 2.0,
 *       'timestamp': 200
 *     }
 *   ]
 * }
 * toTraceJSON(trace)
 * {
 *   type: 'Feature',
 *   properties: {
 *     timestamps: [
 *       100, 200
 *     ],
 *     description: 'some trace'
 *   },
 *   coordinates: [
 *     [1.0,1.0],
 *     [2.0,2.0]
 *   ]
 * }
 */
export function toTraceJSON (trace) {
  const timestamps = trace.points.map(t => t.timestamp)
  const coordinates = trace.points.map(t => [t.longitude, t.latitude])
  return {
    type: 'Feature',
    properties: {
      timestamps,
      description: trace.description
    },
    geometry: {
      type: 'LineString',
      coordinates
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
