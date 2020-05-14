import { createNetworkMiddleware } from 'react-native-offline'
import { createStore, applyMiddleware } from 'redux'
import { persistStore } from 'redux-persist'
import thunk from 'redux-thunk'

import rootReducer from '../reducers'

const initialState = {}

// Base middleware
const networkMiddleware = createNetworkMiddleware()
const middlewares = [networkMiddleware, thunk]

// Add logger in development environment
if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`)
  middlewares.push(logger)
}

// Create store
const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(...middlewares)
)

let persistor = persistStore(store)

export { store, persistor }
