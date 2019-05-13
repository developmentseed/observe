import { presets } from '../presets/presets.json'

/**
 * Returns parent preset of preset
 * For example, returns amenity/bank for the amenity/bank/Citi Bank preset
 * Based on https://github.com/openstreetmap/iD/blob/master/modules/presets/preset.js#L11
 * @param {Object} preset
 * @return {Object} preset
 */

export function getParentPreset (preset) {
  if (!preset || !preset.key) return undefined

  const endIndex = preset.key.lastIndexOf('/')
  if (endIndex < 0) return null

  const parentId = preset.key.substring(0, endIndex)
  const parentPreset = presets[parentId] ? { ...presets[parentId], fields: [...presets[parentId].fields] } : undefined
  return parentPreset
}
