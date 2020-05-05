import { createNetworkMiddleware } from 'react-native-offline'
import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore } from 'redux-persist'
import thunk from 'redux-thunk'

import rootReducer from '../reducers'

const initialState = {}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const networkMiddleware = createNetworkMiddleware()

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(networkMiddleware, thunk))
)

let persistor = persistStore(store)

export { store, persistor }
