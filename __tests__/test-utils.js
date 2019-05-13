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
