import { Platform } from 'react-native'
import MapboxGL from '@mapbox/react-native-mapbox-gl'
import Config from 'react-native-config'

let styleURL = Config.MAPBOX_STYLE_URL || MapboxGL.StyleURL.Street

if (!styleURL.includes(':/') && Platform.OS === 'android') {
  styleURL = `asset:/${styleURL}`
}

export default {}
/*
* Wrapper functions to simplify working with the MapboxGL offline manager
*/

/**
* Create pack of offline tiles
*
* @param {object} options - options object
* @param {string} options.name - name for the pack
* @param {array} options.bounds - bounds for the pack in the form `[[neLng, neLat], [swLng, swLat]]`
* @return {promise}
**/
export function createPack (options) {
  const { name, bounds } = options

  const progressListener = (offlineRegion, status) => {
    // TODO: call redux actions to update ui as needed
    console.log(offlineRegion, status)
  }

  const errorListener = (offlineRegion, err) => {
    // TODO: call redux actions to update ui as needed
    console.log(offlineRegion, err)
  }

  return MapboxGL.offlineManager.createPack({
    name,
    styleURL,
    bounds,
    // TODO: we'll want to test out different min/max zooms
    minZoom: 10,
    maxZoom: 20
  }, progressListener, errorListener)
}
