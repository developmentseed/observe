import { presets } from '../presets/presets.json'

/**
 * Get the default preset for a given geometry type
 * @param String feature type
 * @return Object preset
 */

export default function getDefaultPreset (featureType) {
  if (!featureType) return undefined

  switch (featureType) {
    case 'Point':
      return presets['point']

    case 'LineString':
      return presets['line']

    case 'MultiLineString':
      return presets['line']

    case 'Polygon':
      return presets['area']

    case 'MultiPolygon':
      return presets['area']
  }
}
