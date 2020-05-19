import { presets as allPresets } from '../presets/presets.json'
import presetsObjectToArray from './object-to-array'

// This module is based on the approach of iD editor:
// https://github.com/openstreetmap/iD/blob/7b09b6c0dcd193af04926727b820f346a1d86ca8/modules/osm/tags.js#L17

const presetsArray = presetsObjectToArray(allPresets)

/**
 * Create a reference object with tags suggesting an area
 */
function getAreaTags () {
  // The ignore list is for keys that imply lines. (We always add `area=yes` for exceptions)
  const ignore = [
    'barrier',
    'highway',
    'footway',
    'railway',
    'junction',
    'type'
  ]
  let areaKeys = {}

  // ignore name-suggestion-index and deprecated presets
  const presets = presetsArray.filter((p) => !p.suggestion && !p.replacement)

  // keeplist
  presets.forEach((p) => {
    let key
    for (key in p.tags) break // pick the first tag
    if (!key) return
    if (ignore.indexOf(key) !== -1) return

    if (p.geometry.indexOf('area') !== -1) {
      // probably an area..
      areaKeys[key] = areaKeys[key] || {}
    }
  })

  // discardlist
  presets.forEach((p) => {
    let key
    for (key in p.addTags) {
      // examine all addTags to get a better sense of what can be tagged on lines - #6800
      const value = p.addTags[key]
      if (
        key in areaKeys && // probably an area...
        p.geometry.indexOf('line') !== -1 && // but sometimes a line
        value !== '*'
      ) {
        areaKeys[key][value] = true
      }
    }
  })

  return areaKeys
}

// Init object on load
const osmAreaKeys = getAreaTags()

/**
 * Identifies if a set of tags suggests an area feature and returns associated
 * tags.
 */
export function osmTagSuggestingArea (tags) {
  if (tags.area === 'yes') return { area: 'yes' }
  if (tags.area === 'no') return null

  // `highway` and `railway` are typically linear features, but there
  // are a few exceptions that should be treated as areas, even in the
  // absence of a proper `area=yes` or `areaKeys` tag.. see #4194
  var lineKeys = {
    highway: {
      rest_area: true,
      services: true
    },
    railway: {
      roundhouse: true,
      station: true,
      traverser: true,
      turntable: true,
      wash: true
    }
  }
  var returnTags = {}
  for (var key in tags) {
    if (key in osmAreaKeys && !(tags[key] in osmAreaKeys[key])) {
      returnTags[key] = tags[key]
      return returnTags
    }
    if (key in lineKeys && tags[key] in lineKeys[key]) {
      returnTags[key] = tags[key]
      return returnTags
    }
  }
  return null
}
