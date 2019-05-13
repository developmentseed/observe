/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import { AppRegistry } from 'react-native'
import Config from 'react-native-config'
import MapboxGL from '@mapbox/react-native-mapbox-gl'

import App from './App'
import { name as appName } from './app.json'

MapboxGL.setAccessToken(Config.MAPBOX_ACCESS_TOKEN)

AppRegistry.registerComponent(appName, () => App)
