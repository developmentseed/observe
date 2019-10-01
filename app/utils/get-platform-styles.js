import { Platform } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'

/**
 * Returns style object for appropriate platform
 * @param {Object} platformStyles
 * @param {Object} platformStyles.ios
 * @param {Object} platformStyles.iphoneX
 * @param {Object} platformStyles.android
 * @return {Object}
 */
module.exports = function getPlatformStyles ({ shared = {}, android = {}, ios = {}, iphoneX = {} }) {
  if (Platform.OS === 'ios') {
    return Object.assign({}, shared, isIphoneX() ? (iphoneX) : (ios))
  } else {
    return Object.assign({}, shared, android)
  }
}
