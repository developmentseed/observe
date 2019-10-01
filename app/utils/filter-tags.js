import _omit from 'lodash.omit'
import { metaKeys } from './uninterestingKeys'

/**
 * Filter out nodes with no interesting tags
 * @param {Object} geojson
 * @returns {Object} geojson
 */
export function filterTags (geojson) {
  const data = {
    'type': 'FeatureCollection',
    'features': []
  }
  data.features = geojson.features.filter(feature => {
    const featureTags = _omit(feature.properties, metaKeys)
    return Object.keys(featureTags).length > 0
  })
  return data
}
