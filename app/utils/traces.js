
export function getNewTrace () {
  return {
    points: []
  }
}

export function getPoint (location) {
  return { ...location.coords }
}

/**
 *
 * @param {Object} trace - trace object
 * @returns {Object} - TraceJSON representation of trace
 * @example
 * const trace = {
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
 *     ]
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
      timestamps
    },
    geometry: {
      type: 'LineString',
      coordinates
    }
  }
}
