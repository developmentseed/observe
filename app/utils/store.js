import { createNetworkMiddleware } from 'react-native-offline'
import { createStore, applyMiddleware } from 'redux'
import { persistStore } from 'redux-persist'
import thunk from 'redux-thunk'

import rootReducer from '../reducers'

// Add initial state here
const initialState = {}

const networkMiddleware = createNetworkMiddleware()

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(networkMiddleware, thunk)
)

let persistor = persistStore(store)

export { store, persistor }
