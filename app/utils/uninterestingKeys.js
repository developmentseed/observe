/**
 * Array of keys that are not important to apply filters. See utils/filterTags.js
 */
const uninterestingKeys = [
  'changeset',
  'id',
  'timestamp',
  'uid',
  'user',
  'version',
  'name',
  'phone',
  'addr:city',
  'addr:postcode',
  'addr:street',
  'icon',
  'ndrefs',
  'FIXME',
  'height',
  'levels'
]

/**
 * Array of keys that distinguish from feature tags
 */
const metaKeys = [
  'changeset',
  'id',
  'timestamp',
  'user',
  'version',
  'uid',
  'ndrefs'
]

/**
 * Array of keys that shouldn't be displayed to the user
 */
const hiddenKeys = [
  'ndrefs',
  'icon',
  'uid'
]

/**
 * Conatenated array of all keys that are not OSM properties
 */
const nonpropKeys = metaKeys.concat(hiddenKeys)

export { uninterestingKeys }
export { metaKeys }
export { hiddenKeys }
export { nonpropKeys }
