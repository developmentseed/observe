import { presets } from '../presets/presets.json'

export function getInheritedFields (presetId) {
  const id = stripBraces(presetId)
  if (!presets[id]) return

  const { fields } = { ...presets[id] }
  return fields
}

export function getInheritedMoreFields (presetId) {
  const id = stripBraces(presetId)
  if (!presets[id]) return

  const { moreFields } = { ...presets[id] }
  return moreFields
}

export function inheritsFields (item) {
  if (!item || typeof item !== 'string') return
  return item.match(/\{.*\}/)
}

function stripBraces (text) {
  return text.substring(1, text.length - 1)
}
