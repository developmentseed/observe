import { hiddenKeys } from './uninterestingKeys'

/**
 * Get the fields that match an array of geometries
 * @param {Array} geometry
 * @param {Array} fields
 * @return Array
 */
function getGeometryFields (geometry, fields) {
  if (typeof geometry === 'string') {
    geometry = [geometry]
  }

  return fields
    .filter((field) => {
      return !hiddenKeys.includes(field.key) &&
        field.geometry.some((geom) => geometry.includes(geom))
    })
}

export default getGeometryFields
