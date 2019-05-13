import { purgeCache as purgeCacheAction } from './map'
import { persistor } from '../utils/store'

export function purgeCache () {
  return async dispatch => {
    await dispatch(purgeCacheAction())

    console.warn('Cache purged.')
  }
}

export function purgeStore () {
  return async dispatch => {
    await persistor.purge()

    console.warn('Store purged.')
  }
}
