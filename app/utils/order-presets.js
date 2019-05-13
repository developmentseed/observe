/**
 * Takes an array of presets and order it meaningfully for rendering in the component
 * @param Array presets
 * @return Array presets
 */

export default function orderPresets (presets) {
  const orderedPresets = []
  const labels = []
  const others = []
  for (let i = 0; i < presets.length; i++) {
    if (presets[i].key === 'Type') {
      orderedPresets.splice(0, 0, presets[i])
    } else if (presets[i].key === 'name') {
      orderedPresets.splice(1, 0, presets[i])
    } else if (presets[i].hasOwnProperty('label')) {
      labels.push(presets[i])
    } else {
      others.push(presets[i])
    }
  }
  return orderedPresets.concat(labels, others)
}
