/**
 * @format
 */

import { AppRegistry } from 'react-native'
import Config from 'react-native-config'
import MapboxGL from '@mapbox/react-native-mapbox-gl'
import { setCustomText, setCustomTextInput } from 'react-native-global-props'

import App from './App'
import { name as appName } from './app.json'

MapboxGL.setAccessToken(Config.MAPBOX_ACCESS_TOKEN)
const customTextProps = {
  style: {
    fontSize: 16,
    letterSpacing: 0.5,
    color: 'rgba(19,60,85,1)'
  }
}
const customTextInputProps = {
  style: {
    fontSize: 16,
    letterSpacing: 0.5,
    color: 'rgba(19,60,85,1)'
  }
}
setCustomText(customTextProps)
setCustomTextInput(customTextInputProps)

AppRegistry.registerComponent(appName, () => App)
