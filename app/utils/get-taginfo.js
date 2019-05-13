import * as taginfo from '../presets/taginfo.json'
import _find from 'lodash.find'
import _omit from 'lodash.omit'
import { uninterestingKeys } from './uninterestingKeys'

/**
 * Returns description of the feature
 * @param {Object} feature
 * @return String
 */
export default function getTaginfo (feature) {
  const keys = Object.keys(_omit((feature.properties), uninterestingKeys))
  for (const index in keys) {
    const key = keys[index]
    const match = _find(taginfo.tags, { 'key': key, 'value': feature.properties[key] }) || _find(taginfo.tags, { 'key': key })

    if (match) {
      let description = match.description
      description = description.replace('🄿 ', '')
      description = description.replace('🄵 ', '')
      description = description.replace(' (unsearchable)', '')
      return description
    }
  }

  return null
}
