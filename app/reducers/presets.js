import { presets } from '../presets/presets.json'
import { fields } from '../presets/fields.json'
import { tags } from '../presets/taginfo.json'

const initialState = {
  presets,
  fields,
  tags
}

export default function (state = initialState, action) {
  return state
}
