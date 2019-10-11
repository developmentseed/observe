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

const rootReducer = combineReducers({
  about: AboutReducer,
  authorization: persistReducer(authorizationPersistConfig, AuthorizationReducer),
  map: persistReducer(mapPersistConfig, MapReducer),
  presets: PresetReducer,
  account: AccountReducer,
  edit: persistReducer(editPersistConfig, EditReducer),
  network,
  notification: NotificationReducer,
  photos: CameraReducer
})

export default rootReducer
