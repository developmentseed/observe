export function getFeature (
  id,
  properties = {},
  geometry = {
    type: 'Point',
    coordinates: [0, 0]
  }
) {
  return {
    id,
    type: 'Feature',
    properties: {
      ...properties,
      id
    },
    geometry
  }
}

/**
 * 
 * @param {Number} m - used to construct id, timestamps, coords
 */
export function getMockTrace (m) {
  return {
    id: `id-${m}`,
    pending: true,
    uploading: false,
    geojson: {
      type: 'Feature',
      properties: {
        timestamps: [
          m,
          m + 10,
          m + 20
        ]
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [m, m],
          [m + 1, m - 1],
          [m + 2, m - 2]
        ]
      }
    }
  }
}

