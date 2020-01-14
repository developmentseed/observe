/* global jest */
import * as ReactNative from 'react-native'

function keyMirror (keys) {
  let obj = {}
  keys.forEach((key) => (obj[key] = key))
  return obj
}

jest.doMock('react-native', function () {
  ReactNative.NativeModules.MGLModule = {
    // constants
    UserTrackingModes: {},
    StyleURL: keyMirror([
      'Street',
      'Dark',
      'Light',
      'Outdoors',
      'Satellite',
      'SatelliteStreet',
      'TrafficDay',
      'TrafficNight'
    ]),
    EventTypes: keyMirror([
      'MapClick',
      'MapLongClick',
      'RegionWillChange',
      'RegionIsChanging',
      'RegionDidChange',
      'WillStartLoadingMap',
      'DidFinishLoadingMap',
      'DidFailLoadingMap',
      'WillStartRenderingFrame',
      'DidFinishRenderingFrame',
      'DidFinishRenderingFrameFully',
      'DidFinishLoadingStyle',
      'SetCameraComplete'
    ]),
    CameraModes: keyMirror([
      'Flight',
      'Ease',
      'None'
    ]),
    StyleSource: keyMirror([
      'DefaultSourceID'
    ]),
    InterpolationMode: keyMirror([
      'Exponential',
      'Categorical',
      'Interval',
      'Identity'
    ]),
    LineJoin: keyMirror([
      'Bevel',
      'Round',
      'Miter'
    ]),
    LineCap: keyMirror([
      'Butt',
      'Round',
      'Square'
    ]),
    LineTranslateAnchor: keyMirror([
      'Map',
      'Viewport'
    ]),
    CirclePitchScale: keyMirror([
      'Map',
      'Viewport'
    ]),
    CircleTranslateAnchor: keyMirror([
      'Map',
      'Viewport'
    ]),
    FillExtrusionTranslateAnchor: keyMirror([
      'Map',
      'Viewport'
    ]),
    FillTranslateAnchor: keyMirror([
      'Map',
      'Viewport'
    ]),
    IconRotationAlignment: keyMirror([
      'Auto',
      'Map',
      'Viewport'
    ]),
    IconTextFit: keyMirror([
      'None',
      'Width',
      'Height',
      'Both'
    ]),
    IconTranslateAnchor: keyMirror([
      'Map',
      'Viewport'
    ]),
    SymbolPlacement: keyMirror([
      'Line',
      'Point'
    ]),
    TextAnchor: keyMirror([
      'Center',
      'Left',
      'Right',
      'Top',
      'Bottom',
      'TopLeft',
      'TopRight',
      'BottomLeft',
      'BottomRight'
    ]),
    TextJustify: keyMirror([
      'Center',
      'Left',
      'Right'
    ]),
    TextPitchAlignment: keyMirror([
      'Auto',
      'Map',
      'Viewport'
    ]),
    TextRotationAlignment: keyMirror([
      'Auto',
      'Map',
      'Viewport'
    ]),
    TextTransform: keyMirror([
      'None',
      'Lowercase',
      'Uppercase'
    ]),
    TextTranslateAnchor: keyMirror([
      'Map',
      'Viewport'
    ]),
    LightAnchor: keyMirror([
      'Map',
      'Viewport'
    ]),
    OfflinePackDownloadState: keyMirror([
      'Inactive',
      'Active',
      'Complete'
    ]),
    OfflineCallbackName: keyMirror([
      'Progress',
      'Error'
    ]),

    // methods
    setAccessToken: jest.fn(),
    getAccessToken: () => Promise.resolve('test-token')
  }

  ReactNative.NativeModules.MGLLocationModule = {
    getLastKnownLocation: jest.fn(),
    start: jest.fn(),
    pause: jest.fn()
  }

  ReactNative.NativeModules.MGLOfflineModule = {
    createPack: (packOptions) => {
      return Promise.resolve({
        bounds: packOptions.bounds,
        metadata: JSON.stringify({ name: packOptions.name })
      })
    },
    getPacks: () => Promise.resolve([]),
    deletePack: () => Promise.resolve(),
    pausePackDownload: () => Promise.resolve(),
    resumePackDownload: () => Promise.resolve(),
    setTileCountLimit: jest.fn(),
    setProgressEventThrottle: jest.fn()
  }

  ReactNative.NativeModules.UIManager = {
    RCTView: () => ({
      directEventTypes: {}
    })
  }

  ReactNative.NativeModules.KeyboardObserver = {}

  ReactNative.NativeModules.RNGestureHandlerModule = {
    attachGestureHandler: jest.fn(),
    createGestureHandler: jest.fn(),
    dropGestureHandler: jest.fn(),
    updateGestureHandler: jest.fn(),
    State: {},
    Directions: {}
  }

  ReactNative.NativeModules.RNCNetInfo = {
    getCurrentState: jest.fn(() => Promise.resolve()),
    addListener: jest.fn(),
    removeListeners: jest.fn()
  }

  ReactNative.Platform = {
    OS: 'android'
  }

  return ReactNative
})

jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: () => {
    return {
      base64: '/9j/4AAQSkZJRgABAQAASABIAAD/4QBYRXhpZgAATU0AKgAAAA',
      width: 540,
      height: 780,
      uri: 'file:///Users/geohacker/Library/Developer/CoreSimulator/Devices/4CE00AFA-5C08-4AE7-AC0F-71E72602761A/data/Containers/Data/Application/C9CE7995-ED78-4297-9D9E-773B9BF51B57/Library/Caches/ImageManipulator/591F660D-A509-4608-A685-D2AF29401AA1.jpg'
    }
  }
}))

jest.mock('react-native-cookies', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  openURL: jest.fn(),
  canOpenURL: jest.fn(),
  getInitialURL: jest.fn(),
  get: () => Promise.resolve(null)
}))

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
  hasInternetCredentials: jest.fn(),
  setInternetCredentials: jest.fn(),
  getInternetCredentials: jest.fn(),
  resetInternetCredentials: jest.fn()
}))

jest.mock('redux-persist-filesystem-storage', () => ({
  DocumentDir: ''
}))

jest.mock('rn-fetch-blob', () => ({
  fs: {
    dirs: {
      DocumentDir: ''
    },
    isDir: jest.fn(),
    mkdir: jest.fn(),
    writeFile: jest.fn(),
    unlink: jest.fn(),
    exists: jest.fn(),
    createFile: jest.fn(),
    stat: () => {
      return {
        size: 7000
      }
    },
    mv: jest.fn()
  },
  config: () => {
    return {
      fetch: () => {
        return {
          info: () => {
            return { status: 200 }
          },
          text: jest.fn(),
          path: jest.fn()
        }
      }
    }
  }
}))

jest.mock('react-native-geolocation-service', () => ({
  getCurrentPosition: jest.fn()
}))

jest.mock('react-native-config', () => ({
  OPENCAGE_KEY: 123,
  API_URL: 'http://example.com',
  OBSERVE_API_URL: 'http://localhost:3000'
}))

jest.mock('../../app/utils/get-random-id', () => {
  return jest.fn(() => {
    return 'observe-hauptbanhof'
  })
})
