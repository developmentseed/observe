import fromEntries from 'fromentries'
import Config from 'react-native-config'

import * as types from '../actions/actionTypes'
import _uniqBy from 'lodash.uniqby'
import style from '../style/map'
import _cloneDeep from 'lodash.clonedeep'
import { modes } from '../utils/map-modes'

export const initialState = {
  activeTileRequests: [], // quadkeys of all pending tile requests
  fetchedTiles: {}, // Object with mapping of tiles to their respective GeoJSON FeatureCollections
  selectedFeature: false, // GeoJSON feature that is currently selected, or false
  mode: modes.EXPLORE, // see app/utils/map-modes.js for all modes
  baseLayer: null,
  overlays: {
    osm: true,
    photos: false,
    traces: false
  },
  offlineResources: {},
  lru: [],
  // should be used as a set, but needs to be persisted in order to clean up
  // between app activations
  pendingEviction: [],
  serialNumber: 0,
  style: style,
  selectedPhotos: false
}

const TILE_CACHE_SIZE = Config.TILE_CACHE_SIZE || 10000

export default function (state = initialState, action) {
  switch (action.type) {
    case types.LOADING_DATA_FOR_TILE: {
      const { tile } = action

      const activeTileRequests = new Set(state.activeTileRequests)

      activeTileRequests.add(tile)

      return {
        ...state,
        activeTileRequests: Array.from(activeTileRequests)
      }
    }

    case types.UPDATE_OFFLINE_TILE: {
      const { tile, offline } = action

      const fetchedTiles = {
        ...state.fetchedTiles,
        [tile]: {
          ...state.fetchedTiles[tile],
          offline
        }
      }

      return {
        ...state,
        fetchedTiles
      }
    }

    case types.LOADED_DATA_FOR_TILE: {
      const { tile, offline } = action
      const activeTileRequests = new Set(state.activeTileRequests)

      const fetchedTiles = {
        ...state.fetchedTiles,
        [tile]: {
          key: tile,
          offline,
          loadedAt: Date.now()
        }
      }

      activeTileRequests.delete(tile)

      return {
        ...state,
        activeTileRequests: Array.from(activeTileRequests),
        fetchedTiles
      }
    }

    case types.FAILED_LOADING_DATA_FOR_TILE: {
      const { tile, err } = action
      const activeTileRequests = new Set(state.activeTileRequests)

      console.warn(err)
      activeTileRequests.delete(tile)

      return {
        ...state,
        activeTileRequests: Array.from(activeTileRequests)
      }
    }

    case types.REQUESTED_TILE: {
      const { tile, offline } = action
      const { lru } = state
      let { fetchedTiles, pendingEviction } = state

      const offlineTiles = lru.filter(t => t.offline)
      const ephemeralTiles = lru.filter(t => !t.offline)

      let offlineTags = new Set()

      if (offline) {
        offlineTags.add(offline)
      }

      if (fetchedTiles[tile] != null && fetchedTiles[tile].offline) {
        fetchedTiles[tile].offline.forEach(offlineTags.add, offlineTags)
      }

      if (offlineTags.size > 0) {
        // convert to an array
        offlineTags = Array.from(offlineTags)
      } else {
        offlineTags = false
      }

      // segment the LRU, treating offline tiles with preference
      let updatedLRU = [
        {
          tile,
          // is the requested tile an offline tile?
          offline: offlineTags
        },
        ...offlineTiles.concat(ephemeralTiles)
      ]

      if (
        offlineTiles.length < TILE_CACHE_SIZE &&
        updatedLRU.length > TILE_CACHE_SIZE
      ) {
        // we're over size limits AND we have ephemeral tiles that can be removed
        const numberToKeep = Math.max(TILE_CACHE_SIZE, offlineTiles.length)
        const toRemove = updatedLRU.slice(numberToKeep)
        updatedLRU = updatedLRU.slice(0, numberToKeep)

        // console.log('evicting', toRemove.length, 'data tiles')

        const pendingEvictionSet = new Set(pendingEviction)

        // clone so that delete doesn't modify the previous version
        const fetchedTiles = {
          ...state.fetchedTiles
        }

        // these tiles will be evicted by the LRU cache when space is needed
        // (effectively garbage collected)
        toRemove.forEach(({ tile }) => {
          delete fetchedTiles[tile]
          pendingEviction.add(tile)
        })

        pendingEviction = Array.from(pendingEvictionSet)
      }

      return {
        ...state,
        fetchedTiles,
        lru: updatedLRU,
        pendingEviction
      }
    }

    case types.EVICTED_TILE: {
      const { tile } = action
      const pendingEviction = new Set(state.pendingEviction)

      pendingEviction.delete(tile)

      return {
        ...state,
        pendingEviction: Array.from(pendingEviction)
      }
    }

    case types.CLEAR_OSM_DATA: {
      const { offline } = action

      let fetchedTiles = null
      let lru = null

      if (offline === true) {
        // clear all data
        fetchedTiles = {}
        lru = []
      } else {
        // clear tagged data
        const offlinePredicate = x =>
          // drop offline tiles tagged with only the specified tag
          !(
            x.offline &&
            x.offline.length === 1 &&
            x.offline.includes(offline)
          )

        const offlineFilter = tile =>
          tile.offline ? tile.offline.filter(t => t !== offline) : false

        fetchedTiles = fromEntries(
          Object.entries(state.fetchedTiles)
            .filter(([k, v]) => offlinePredicate(v))
            .map(([k, v]) => [
              k,
              {
                ...v,
                offline: offlineFilter(v)
              }
            ])
        )
        lru = state.lru.filter(offlinePredicate).map(tile => ({
          ...tile,
          offline: offlineFilter(tile)
        }))

        // TODO this really ought to update pendingEviction with the list of
        // tiles removed (so that they can be removed from the filesystem)
      }

      return {
        ...state,
        fetchedTiles,
        lru
      }
    }

    case types.SET_SELECTED_FEATURE:
      return {
        ...state,
        selectedFeature: action.feature
      }

    case types.SET_SELECTED_FEATURES:
      let features = action.features
      features = _uniqBy(features, 'id')
      return {
        ...state,
        selectedFeatures: features
      }

    case types.START_ADD_POINT:
      return {
        ...state,
        mode: modes.ADD_POINT
      }

    // Currently, back on map is only triggered when the user is not in Explore mode.
    // Back button always sets the user back to Explore mode
    // This will need to be changed if we need more complex handling down the line.
    case types.MAP_BACK_PRESS:
      return {
        ...state,
        mode: modes.EXPLORE
      }

    case types.SET_MAP_MODE:
      return {
        ...state,
        mode: action.mode
      }

    case types.UPDATE_VISIBLE_BOUNDS: {
      const { visibleBounds, zoom } = action

      return {
        ...state,
        visibleBounds,
        zoom
      }
    }

    case types.PURGING_CACHE: {
      return {
        ...state,
        offlineResources: {}
      }
    }

    case types.FETCHING_OFFLINE_RESOURCES: {
      const { id, name, aoi, satellite } = action

      const offlineResources = {
        ...state.offlineResources,
        [id]: {
          id,
          name,
          aoi,
          satellite,
          data: {
            size: 0,
            percentage: 0
          },
          mapTiles: {
            size: 0,
            percentage: 0,
            completed: 0,
            total: null
          },
          satelliteTiles: {
            size: 0,
            percentage: 0,
            completed: 0,
            total: null
          }
        }
      }

      return {
        ...state,
        offlineResources
      }
    }

    case types.REFRESHING_OFFLINE_RESOURCES: {
      const { id } = action

      const offlineResources = {
        ...state.offlineResources,
        [id]: {
          ...state.offlineResources[id],
          // reset tile size
          data: {
            size: 0,
            percentage: 0
          }
        }
      }

      return {
        ...state,
        offlineResources
      }
    }

    case types.OSM_DATA_PROGRESS:
    case types.OSM_DATA_COMPLETE: {
      // size is incremental
      const { id, percentage, size } = action

      if (state.offlineResources[id] != null) {
        const offlineResources = {
          ...state.offlineResources,
          [id]: {
            ...state.offlineResources[id],
            data: {
              percentage,
              size: state.offlineResources[id].data.size + (size || 0)
            }
          }
        }

        return {
          ...state,
          offlineResources
        }
      }

      return state
    }

    case types.OFFLINE_PACK_PROGRESS:
    case types.OFFLINE_PACK_COMPLETE: {
      // size is total size
      const { id, percentage, satellite, size, total, completed } = action

      const status = {
        percentage,
        size,
        total,
        completed
      }

      const key = satellite ? 'satelliteTiles' : 'mapTiles'

      const offlineResources = {
        ...state.offlineResources,
        [id]: {
          ...state.offlineResources[id],
          [key]: status
        }
      }

      return {
        ...state,
        offlineResources
      }
    }

    case types.FAILED_CREATING_OFFLINE_PACK: {
      const { name, id, error, satellite } = action

      console.log(`Failed creating offline pack for ${name}`, error)

      const key = satellite ? 'satelliteTiles' : 'mapTiles'

      const offlineResources = {
        ...state.offlineResources,
        [id]: {
          ...state.offlineResources[id],
          failed: true,
          [id]: {
            ...state.offlineResources[id][key],
            error
          }
        }
      }

      return {
        ...state,
        offlineResources
      }
    }

    case types.FAILED_FETCHING_OFFLINE_RESOURCES:
    case types.FAILED_REFRESHING_OFFLINE_RESOURCES: {
      const { id, error } = action

      const offlineResources = {
        ...state.offlineResources,
        [id]: {
          ...state.offlineResources[id],
          error
        }
      }

      return {
        ...state,
        offlineResources
      }
    }

    case types.DELETE_OFFLINE_RESOURCE: {
      const { id } = action

      if (state.offlineResources[id] != null) {
        const offlineResources = {
          ...state.offlineResources,
          [id]: {
            ...state.offlineResources[id],
            deleting: true
          }
        }

        // TODO re-tag fetchedTiles (remove id)

        return {
          ...state,
          offlineResources
        }
      }

      return state
    }

    case types.DELETED_OFFLINE_RESOURCE: {
      const { id } = action

      const offlineResources = fromEntries(
        Object.entries(state.offlineResources).filter(([k, v]) => k !== id)
      )

      return {
        ...state,
        offlineResources
      }
    }

    case types.RENAME_OFFLINE_RESOURCE: {
      const { id, name } = action

      return {
        ...state,
        offlineResources: {
          ...state.offlineResources,
          [id]: {
            ...state.offlineResources[id],
            name
          }
        }
      }
    }

    case types.SET_BASEMAP:
      return {
        ...state,
        baseLayer: action.baseLayer
      }

    case types.TOGGLE_OVERLAY:
      let overlays = { ...state.overlays }
      overlays[action.layer] = !overlays[action.layer]
      let updatedStyle = _cloneDeep(state.style)
      updatedStyle.traces.traces.visibility = overlays['traces'] ? 'visible' : 'none'
      Object.keys(updatedStyle['osm']).forEach(key => {
        updatedStyle.osm[key].visibility = overlays['osm'] ? 'visible' : 'none'
      })

      Object.keys(updatedStyle['photos']).forEach(key => {
        updatedStyle.photos[key].visibility = overlays['photos'] ? 'visible' : 'none'
      })

      return {
        ...state,
        overlays,
        style: updatedStyle
      }

    case types.NEW_DATA_AVAILABLE: {
      const { serialNumber } = state

      return {
        ...state,
        serialNumber: serialNumber + 1
      }
    }

    case types.SET_SELECTED_PHOTOS: {
      return {
        ...state,
        selectedPhotos: action.photos
      }
    }
  }
  return state
}
