import { PHOTO_PENDING_STATUS, TRACE_PENDING_STATUS } from "../app/constants"

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
    status: TRACE_PENDING_STATUS,
    errors: [],
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

export function getMockPhoto (data) {
  const mockLocation = {
    coords: {
      accuracy: 5,
      altitude: 0,
      altitudeAccuracy: -1,
      heading: -1,
      latitude: 37.33233141,
      longitude: -122.0312186,
      speed: 0
    },
    timestamp: 1571221845199.04
  }

  const photo = {
    id: 'observe-hauptbanhof',
    description: 'test photo',
    path: '/photos/observe-hauptbanhof.jpg',
    location: mockLocation,
    status: data.status || PHOTO_PENDING_STATUS,
    errors: [],
    featureId: data.featureId || null,
    apiId: data.apiId || null,
    base64: '/9j/4AAQSkZJRgABAQAASABIAAD/4QBYRXhpZgAATU0AKgAAAA'
  }

  return photo
}
