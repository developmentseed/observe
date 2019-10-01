import { categories } from '../presets/categories.json'

/**
 * Get the category of a feature
 * @param {Object<GeoJSON Feature>} feature
 * @return Object
 */
function getCategory (feature) {
  for (let category in categories) {
    const { members } = category

    for (let member in members) {
      if (Object.keys(feature.properties).includes(member)) {
        return category
      }
    }
  }
}

export default getCategory
