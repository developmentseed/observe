/* global jest */

jest.mock('NativeModules', function () {
  function keyMirror (keys) {
    let obj = {}
    keys.forEach((key) => (obj[key] = key))
    return obj
  }

  return {
    MGLModule: {
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
    },
    MGLOfflineModule: {
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
    },
    UIManager: {
      RCTView: () => ({
        directEventTypes: {}
      })
    },
    KeyboardObserver: {},
    RNGestureHandlerModule: {
      attachGestureHandler: jest.fn(),
      createGestureHandler: jest.fn(),
      dropGestureHandler: jest.fn(),
      updateGestureHandler: jest.fn(),
      State: {},
      Directions: {}
    },
    PlatformConstants: {
      forceTouchAvailable: false
    }
  }
})

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
