import Config from 'react-native-config'
import turfCentroid from '@turf/centroid'
import bboxPolygon from '@turf/bbox-polygon'

export async function getPlaceName (aoi) {
  if (!Config.OPENCAGE_KEY) {
    return null
  }

  const polygon = bboxPolygon(aoi)
  const center = turfCentroid(polygon)
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${center.geometry.coordinates[1]}+${center.geometry.coordinates[0]}&key=${Config.OPENCAGE_KEY}&abbrv=1`
  const response = await fetch(url)
  if (response.status !== 200) {
    console.warn('Geocoding failed:', await response.text())
    return null
  }

  const results = await response.json()
  if (results.results.length) {
    const result = results.results[0]

    const components = result.components || null

    if (components) {
      const slugOne = components.neighbourhood || components.suburb || components.locality
      const slugTwo = components.village || components.city || components.county || components.state_district || components.state || components.country

      return [slugOne, slugTwo].filter(x => x != null).join(', ')
    }

    if (result.formatted) {
      return result.formatted
    }
  }
  return null
}
