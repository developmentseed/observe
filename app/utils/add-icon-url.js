import * as taginfo from '../presets/taginfo.json'
import { uninterestingKeys } from './uninterestingKeys'
import _omit from 'lodash.omit'
import _find from 'lodash.find'

/**
 * Parses through each feature, and adds icon url to properties
 * The icon property is used for styling later
 * @param {Object} geojson
 * @return {Object} geojson
 */
export function addIconUrl (geojson) {
  if (geojson.type === 'FeatureCollection') {
    const points = geojson.features.filter(feature => {
      return feature.geometry.type === 'Point'
    })
    points.forEach(feature => {
      setIcon(feature)
    })
  } else {
    setIcon(geojson)
  }
  return geojson
}

function setIcon (feature) {
  feature.properties.icon = undefined
  const featureTags = _omit(feature.properties, uninterestingKeys)
  const keys = Object.keys(featureTags)
  for (const index in keys) {
    const key = keys[index]
    const match = _find(taginfo.tags, { 'key': key, 'value': featureTags[key] })
    if (match) {
      if (match.icon_url != null) {
        feature.properties.icon = match.icon_url.replace(/-/g, '_')
      }
      break
    }
  }
  if (!feature.properties.icon || feature.properties.icon.startsWith('iD-')) {
    feature.properties.icon = 'maki_marker'
  }
  return feature
}
