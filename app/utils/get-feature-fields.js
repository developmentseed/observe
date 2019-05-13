import { fields } from '../presets/fields.json'

import { hiddenKeys } from './uninterestingKeys'

/**
 * Get the fields of a feature
 * @param {Object<GeoJSON Feature>} feature
 * @return Array
 */
function getFeatureFields (feature) {
  const propertyKeys = Object.keys(feature.properties).filter((key) => {
    return !hiddenKeys.includes(key)
  })

  const presetFields = propertyKeys.map((key) => {
    const preset = key + '/' + feature.properties[key]
    const prop = Object.assign({}, fields[preset] || fields[key] || {})
    prop.value = feature.properties[key]
    if (!prop.key) prop.key = key
    return prop
  })

  return presetFields
}

export default getFeatureFields
