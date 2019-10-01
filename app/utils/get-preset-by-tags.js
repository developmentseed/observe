import { presets } from '../presets/presets.json'

/**
 * Get the default preset for a given geometry type
 * @param String feature type
 * @return Object preset
 */

export default function getPresetByTags (tags) {
  const scoreIndex = {}

  Object.keys(presets).forEach((presetKey) => {
    const preset = presets[presetKey]

    if (scoreIndex[presetKey] === undefined) {
      scoreIndex[presetKey] = preset.matchScore || 0
    }

    Object.keys(preset.tags).forEach((tagKey) => {
      const tag = preset.tags[tagKey]

      if (tags[tagKey] && tag && tags[tagKey] === tag) {
        scoreIndex[presetKey] += (preset.matchScore || 1)
      } else if (tag === '*' && tagKey in tags) {
        scoreIndex[presetKey] += (preset.matchScore || 1) / 2
      } else {
        scoreIndex[presetKey] += -1
      }
    })
  })

  const scores = Object.keys(scoreIndex).map((key) => {
    return {
      key,
      score: scoreIndex[key]
    }
  })

  const result = scores.sort((a, b) => {
    if (a.score > b.score) {
      return -1
    }
    if (a.score < b.score) {
      return 1
    }
    return 0
  })

  // if nothing matches we can later select a preset by geometry type
  if (result[0].score === 0) {
    return
  }

  return presets[result[0].key]
}
