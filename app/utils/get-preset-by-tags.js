import { presets } from '../presets/presets.json'

/**
 * Get the match score of a preset for a set of tags. Based on:
 * https://github.com/openstreetmap/iD/blob/8deec6daa9a5803e77164fb39cf898a306148309/modules/presets/preset.js#L53
 * @param Object preset
 * @param Object entityTags
 * @return Number preset score
 */
function getMatchScore (preset, entityTags) {
  let seen = {}
  let score = 0
  const matchScore = preset.matchScore || 1

  // match on tags
  for (let k in preset.tags) {
    seen[k] = true

    if (entityTags[k] === preset.tags[k]) {
      // If tag is a perfect match, add full score
      score += matchScore
    } else if (preset.tags[k] === '*' && k in entityTags) {
      // If tag is a partial match, add half score
      score += matchScore / 2
    } else {
      // If no match, make score negative
      return -1
    }
  }

  // boost score for additional matches in addTags
  const addTags = preset.addTags
  for (let k in addTags) {
    if (!seen[k] && entityTags[k] === addTags[k]) {
      score += matchScore
    }
  }

  return score
}

/**
 * Get the default preset for a given geometry type
 * @param String feature type
 * @return Object preset
 */
export default function getPresetByTags (tags) {
  const scores = Object.keys(presets).map((key) => {
    return {
      key,
      score: getMatchScore(presets[key], tags)
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
