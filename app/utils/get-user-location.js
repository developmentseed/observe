import Geolocation from 'react-native-geolocation-service'
import { PermissionsAndroid, Platform } from 'react-native'

const { ACCESS_FINE_LOCATION } = PermissionsAndroid.PERMISSIONS
const { GRANTED } = PermissionsAndroid.RESULTS
const properties = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 1000
}

export default function getUserLocation () {
  return new Promise(async (resolve, reject) => {
    if (Platform.OS === 'android') {
      const locationPermission = await PermissionsAndroid.request(ACCESS_FINE_LOCATION)
      if (locationPermission !== GRANTED) {
        throw new Error('Observe failed to get location access from Android')
      }
    }
    Geolocation.getCurrentPosition(location => {
      resolve(location)
    },
    error => {
      console.log('location fetch error', error)
      reject(error)
    }, properties)
  })
}
