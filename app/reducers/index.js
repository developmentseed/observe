import { reducer as network } from 'react-native-offline'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import FilesystemStorage from 'redux-persist-filesystem-storage'

import AboutReducer from './about'
import AuthorizationReducer from './authorization'
import MapReducer from './map'
import PresetReducer from './presets'
import AccountReducer from './account'
import EditReducer from './edit'
import NotificationReducer from './notification'
import CameraReducer from './camera'
import TracesReducer from './traces'
import ObserveAPIReducer from './observeApi'
import WayEditingReducer from './wayEditing'
import WayEditingHistoryReducer from './wayEditingHistory'

const authorizationPersistConfig = {
  key: 'authorization',
  storage,
  whitelist: ['isAuthorized']
}

const mapPersistConfig = {
  key: 'map',
  storage: FilesystemStorage,
  whitelist: ['fetchedTiles', 'lru', 'offlineResources', 'pendingEviction']
}

const editPersistConfig = {
  key: 'edit',
  storage,
  whitelist: [
    'edits',
    'uploadedEdits',
    'editsGeojson'
  ]
}

const tracesPersistConfig = {
  key: 'traces',
  storage,
  whitelist: [
    'currentTrace',
    'traces'
  ]
}

const observeApiPersistConfig = {
  key: 'observeApi',
  storage,
  whitelist: [
    'token'
  ]
}

const photosPersistConfig = {
  key: 'photos',
  storage,
  whitelist: [
    'photos'
  ]
}

const rootReducer = combineReducers({
  about: AboutReducer,
  authorization: persistReducer(authorizationPersistConfig, AuthorizationReducer),
  map: persistReducer(mapPersistConfig, MapReducer),
  presets: PresetReducer,
  account: AccountReducer,
  edit: persistReducer(editPersistConfig, EditReducer),
  wayEditing: WayEditingReducer,
  wayEditingHistory: WayEditingHistoryReducer,
  network,
  notification: NotificationReducer,
  traces: persistReducer(tracesPersistConfig, TracesReducer),
  observeApi: persistReducer(observeApiPersistConfig, ObserveAPIReducer),
  photos: persistReducer(photosPersistConfig, CameraReducer)
})

export default rootReducer
