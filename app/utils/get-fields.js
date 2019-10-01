import { fields } from '../presets/fields.json'

import { hiddenKeys } from './uninterestingKeys'

/**
 * Get the fields for an array of field keys
 * @param {Array} fieldKeys
 * @return Array
 */
function getFields (fieldKeys) {
  return fieldKeys
    .filter((key) => !hiddenKeys.includes(key))
    .map((key) => {
      const prop = { ...fields[key] } || {}
      if (!prop.key) prop.key = key
      return prop
    })
}

export default getFields
