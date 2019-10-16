import Config from 'react-native-config'
import DOMParser from 'xmldom'
import MapboxGL from '@react-native-mapbox-gl/maps'
import PQueue from 'p-queue'
import RNFetchBlob from 'rn-fetch-blob'
import forge from 'node-forge'
import osmtogeojson from 'osmtogeojson'
import sizeof from 'object-sizeof'

import * as types from './actionTypes'
import { setNotification } from './notification'
import { getOfflineResources, getOfflineResourceStatus, getPendingEviction } from '../selectors'
import { saveDataForTile } from '../services/api'
import { bboxToTiles } from '../utils/bbox'
import cache from '../utils/data-cache'
import { filterRelations } from '../utils/filter-xml'

const queue = new PQueue({
  concurrency: 4
})

const XML_PARSER = new DOMParser.DOMParser()

export function purgeCache () {
  return async dispatch => {
    dispatch({
      type: types.PURGING_CACHE
    })

    await Promise.all([
      // delete offline data packs
      dispatch(deletePacks()),

      // delete cached OSM data
      dispatch(clearData(true))
    ])

    dispatch({
      type: types.PURGED_CACHE
    })
  }
}

/**
 * Clear cached OSM data.
 * @param {boolean|String} offline Whether to remove offline data (and if so, which key to clear)
 */
export function clearData (offline = false) {
  return {
    type: types.CLEAR_OSM_DATA,
    offline
  }
}

export function deletePack (pack) {
  return async dispatch => {
    dispatch({
      type: types.DELETING_PACK,
      pack
    })

    try {
      await MapboxGL.offlineManager.deletePack(pack)
      dispatch({
        type: types.DELETED_PACK,
        pack
      })
    } catch (error) {
      console.log(`Failed to delete pack '${pack}:`, error)
      dispatch({
        type: types.FAILED_DELETING_PACK,
        pack,
        error
      })
    }
  }
}

export function deletePacks () {
  return async dispatch => {
    dispatch({
      type: types.DELETING_PACKS
    })

    const packs = await MapboxGL.offlineManager.getPacks()

    await Promise.all(packs.map(p => dispatch(deletePack(p.name))))

    dispatch({
      type: types.DELETED_PACKS
    })
  }
}

/**
 * Fetch data for a desired bounding box by fetching data for each tile that
 * comprises it.
 * @param {Array<Array<number>>} bbox - bounding box
 * @param {boolean|String} offline - if this bbox is for offline use
 * @param {function} progressListener - report status updates
 */
export function fetchData (
  bbox,
  offline = false,
  force = false,
  progressListener = () => {}
) {
  const fn = async (dispatch, getState) => {
    // TODO refactor this to use a generator
    const tiles = bboxToTiles(bbox)
    const total = tiles.length
    let fetched = 0

    const listener = (tile, size) => {
      fetched++

      // TODO throttle this
      progressListener({
        percentage: Number(((fetched / total) * 100).toFixed(2)),
        size
      })
    }

    for (const tile of tiles) {
      const {
        map: { offlineResources }
      } = getState()

      if (
        offline &&
        (offlineResources[offline] == null ||
          offlineResources[offline].deleting)
      ) {
        // the offline resource that is being fetched is no longer active; do
        // nothing
        return
      }

      // using knowledge that fetchDataForTile uses queue, wait for it to be
      // empty (all queued tasks actively executing) before continuing
      await queue.onEmpty()
      dispatch(fetchDataForTile(tile, offline, force, listener))
    }
  }

  // skip when offline
  fn.interceptInOffline = true

  return fn
}

/**
 * Fetches data for a single tile. Calls `loadingDataForTile` prior to
 * initiating the request and `loadedDataForTile` with data after it is
 * fetched or `failedLoadingDataForTile` if the request failed.
 * @param {String<quadkey>} tile - quadkey of tile to fetch data for
 * @param {boolean|String} offline = if this tile is for offline use
 * @param {function} progressListener - report status updates
 */
export function fetchDataForTile (
  tile,
  offline = false,
  force = false,
  progressListener = () => {}
) {
  const fn = async (dispatch, getState) => {
    // indicate that this tile was requested (to facilitate LRU pruning of tiles)
    dispatch(requestedTile(tile, offline))

    const {
      map: { activeTileRequests, fetchedTiles }
    } = getState()

    // existing tile, if present
    const cachedTile = fetchedTiles[tile]
    // should we skip the request for this tile?
    let skipRequest = false
    // was this tile previously marked for offline usage?
    let previouslyOffline = false
    // offline resource ids that this tile is part of
    let offlineTags = new Set()

    if (offline) {
      // add new offline tag
      offlineTags.add(offline)
    }

    if (cachedTile != null) {
      const { loadedAt } = cachedTile
      // preserve offline status
      previouslyOffline = cachedTile.offline

      if (previouslyOffline) {
        // append all previous tags
        previouslyOffline.forEach(offlineTags.add, offlineTags)
      }

      if (!force && loadedAt > Date.now() - 86400e3) {
        // if data was loaded within the last day, ignore this request
        skipRequest = true
      }
    }

    if (offlineTags.size > 0) {
      // convert to an array
      offlineTags = Array.from(offlineTags)
    } else {
      // convert to a boolean for truthiness tests
      offlineTags = false
    }

    if (activeTileRequests.includes(tile) || skipRequest) {
      // ignore this request; it's either already active or data was deemed
      // sufficiently recent
      if (offline && cachedTile != null) {
        // touch this tile and update its tags
        dispatch(updateOfflineTile(tile, offlineTags))
      }

      let size = 0

      if (cachedTile != null) {
        size = sizeof(cache.get(cachedTile.key))
      }

      // NOTE: this will report a size of 0 for a new tile where the request is
      // in progress
      progressListener(tile, size)
      return
    }

    try {
      dispatch(loadingDataForTile(tile))
      const size = await queue.add(saveDataForTile.bind(null, tile))
      progressListener(tile, size)
      cache.del(tile)
      dispatch(loadedDataForTile(tile, offlineTags))
    } catch (err) {
      dispatch(failedLoadingDataForTile(tile, err))
      console.log('failed loading data for tile', err)
      console.log('failed loading data for tile', err.stack)
    }

    // call updateVisibleBounds to ensure map is refreshed
    const { visibleBounds, zoom } = getState().map
    dispatch(updateVisibleBounds(visibleBounds, zoom))

    // remove tiles pending eviction from the cache and filesystem
    const pendingEviction = getPendingEviction(getState())
    if (pendingEviction.length > 0) {
      console.log(`Evicting ${pendingEviction.length} tiles`)
    }

    for (const tile of pendingEviction) {
      try {
        // remove from the cache
        cache.del(tile)

        const dirname = `${RNFetchBlob.fs.dirs.DocumentDir}/${tile.slice(0, 8)}`
        const filename = `${dirname}/${tile}.osm.xml`

        // remove from the filesystem
        try {
          await RNFetchBlob.fs.unlink(filename)
        } catch (err) {
          console.warn('File unlink failed', err)
        }

        const files = await RNFetchBlob.fs.ls(dirname)

        if (files.length === 0) {
          // no files remaining; remove the directory
          await RNFetchBlob.fs.unlink(dirname)
        }

        dispatch(evictedTile(tile))
      } catch (err) {
        console.log('Problem occurred while removing evicted tile:', err)
      }
    }
  }

  // skip when offline
  fn.interceptInOffline = true

  return fn
}

// MapboxGL's OfflineManager (on Android) requires that this URL be remote, as
// parsing an asset:/ URI results in a null httpUrl (which is subsequently
// used):
// https://github.com/mapbox/mapbox-gl-native/blob/2d11d89547b79150c93c9c265fda71c769d457af/platform/android/MapboxGLAndroidSDK/src/main/java/com/mapbox/mapboxsdk/http/HTTPRequest.java#L63-L67
const osmStyleURL = Config.REMOTE_MAPBOX_STYLE_URL || MapboxGL.StyleURL.Street
const satelliteStyleURL = Config.REMOTE_SATELLITE_STYLE_URL

export function fetchOfflineResources (name, aoi) {
  const fn = async (dispatch, getState) => {
    const offlineResources = getOfflineResources(getState())

    // generate a random ID to identify this resource
    const id = forge.util.bytesToHex(forge.random.getBytes(4))

    if (offlineResources[id] != null) {
      return dispatch({
        type: types.OFFLINE_RESOURCE_ALREADY_EXISTS,
        id,
        name
      })
    }

    // MapboxGL expects these as [[maxX, maxY], [minX, minY]]
    const bounds = [[aoi[2], aoi[3]], [aoi[0], aoi[1]]]

    dispatch({
      type: types.FETCHING_OFFLINE_RESOURCES,
      id,
      name,
      aoi,
      satellite: satelliteStyleURL != null
    })

    const osmLoader = async () => {
      await dispatch(
        fetchData(bounds, id, true, ({ percentage, size }) =>
          dispatch({
            type: types.OSM_DATA_PROGRESS,
            id,
            percentage,
            size
          })
        )
      )

      dispatch({
        type: types.OSM_DATA_COMPLETE,
        id,
        percentage: 100
      })
    }

    try {
      const data = osmLoader()

      // increase the number of tiles MapboxGL is willing to store offline
      const tileDownloadLimit = Config.MAPBOX_OFFLINE_TILE_DOWNLOAD_LIMIT ? parseInt(Config.MAPBOX_OFFLINE_TILE_DOWNLOAD_LIMIT) : 6000
      MapboxGL.offlineManager.setTileCountLimit(tileDownloadLimit)

      const mapTiles = MapboxGL.offlineManager.createPack(
        {
          name: id,
          bounds,
          // maxZoom is offset by 1 when using 256x256 raster tiles
          maxZoom: 18 - 1,
          styleURL: osmStyleURL
        },
        (
          region,
          {
            state,
            completedResourceSize: size,
            percentage,
            requiredResourceCount: total,
            completedResourceCount: completed
          }
        ) => {
          if (state === MapboxGL.OfflinePackDownloadState.Active) {
            return dispatch({
              type: types.OFFLINE_PACK_PROGRESS,
              id,
              size,
              percentage,
              total,
              completed
            })
          }

          dispatch({
            type: types.OFFLINE_PACK_COMPLETE,
            id,
            size,
            percentage,
            total,
            completed
          })

          const status = getOfflineResourceStatus(getState())[id]

          if (status.percentage === 100) {
            dispatch(setNotification({
              message: `${name} downloaded.`
            }))
          }
        },
        ({ name }, error) =>
          dispatch({
            type: types.FAILED_CREATING_OFFLINE_PACK,
            name,
            id,
            error
          })
      )
      const satelliteTiles =
        satelliteStyleURL &&
        MapboxGL.offlineManager.createPack(
          {
            name: `${id}-satellite`,
            bounds,
            maxZoom: 18 - 1,
            styleURL: satelliteStyleURL
          },
          (
            region,
            {
              state,
              completedResourceSize: size,
              percentage,
              requiredResourceCount: total,
              completedResourceCount: completed
            }
          ) => {
            if (state === MapboxGL.OfflinePackDownloadState.Active) {
              return dispatch({
                type: types.OFFLINE_PACK_PROGRESS,
                id,
                size,
                percentage,
                total,
                completed,
                satellite: true
              })
            }

            dispatch({
              type: types.OFFLINE_PACK_COMPLETE,
              id,
              size,
              percentage,
              total,
              completed,
              satellite: true
            })

            const status = getOfflineResourceStatus(getState())[id]

            if (status.percentage === 100) {
              dispatch(setNotification({
                message: `${name} downloaded.`
              }))
            }
          },
          ({ name }, error) =>
            dispatch({
              type: types.FAILED_CREATING_OFFLINE_PACK,
              name,
              id,
              error,
              satellite: true
            })
        )

      await Promise.all([
        data,
        mapTiles,
        // optional satellite tiles (only if configured)
        satelliteTiles
      ])

      dispatch({
        type: types.FETCHED_OFFLINE_RESOURCES,
        name,
        id
      })

      const status = getOfflineResourceStatus(getState())[id]

      if (status.percentage === 100) {
        dispatch(setNotification({
          message: `${name} downloaded.`
        }))
      }
    } catch (error) {
      console.warn('loading offline resources failed:', error)
      dispatch({
        type: types.FAILED_FETCHING_OFFLINE_RESOURCES,
        name,
        id,
        error
      })

      dispatch(setNotification({
        level: 'error',
        message: `${name} could not be downloaded.`
      }))
    }
  }

  // skip when offline
  fn.interceptInOffline = true

  return fn
}

export function deleteOfflineResource (id) {
  return async (dispatch, getState) => {
    dispatch({
      type: types.DELETE_OFFLINE_RESOURCE,
      id
    })

    const { name } = getOfflineResourceStatus(getState())[id]

    dispatch(clearData(id))

    try {
      const status = getOfflineResourceStatus(getState())
      const packs = [id]

      if (status[id].satellite) {
        packs.push(`${id}-satellite`)
      }

      console.log(`deleting ${packs.length} offline pack(s)`)

      await Promise.all(packs.map(p => MapboxGL.offlineManager.deletePack(p)))

      // NOTE: this doesn't delete OSM XML from the filesystem;
      // DELETE_OFFLINE_RESOURCE should result in associated tiles having this
      // resource removed from their offline tags (in the state reducer),
      // freeing them up to be evicted in the future

      dispatch({
        type: types.DELETED_OFFLINE_RESOURCE,
        id
      })

      dispatch(setNotification({
        message: `${name} deleted.`
      }))
    } catch (error) {
      console.warn(error)

      dispatch({
        type: types.FAILED_DELETING_OFFLINE_RESOURCE,
        id,
        error
      })

      dispatch(setNotification({
        level: 'error',
        message: `${name} could not be deleted.`
      }))
    }
  }
}

export function refreshOfflineResource (id) {
  const fn = async (dispatch, getState) => {
    dispatch({
      type: types.REFRESHING_OFFLINE_RESOURCES,
      id
    })

    const { name } = getOfflineResourceStatus(getState())[id]

    const status = getOfflineResourceStatus(getState())
    const { aoi } = status[id]
    const bounds = [[aoi[2], aoi[3]], [aoi[0], aoi[1]]]

    try {
      await dispatch(
        fetchData(bounds, id, true, ({ percentage, size }) =>
          dispatch({
            type: types.OSM_DATA_PROGRESS,
            id,
            percentage,
            size
          })
        )
      )

      // TODO tiles are expensive, but should they be updated too?

      dispatch({
        type: types.OSM_DATA_COMPLETE,
        id,
        percentage: 100
      })

      dispatch({
        type: types.REFRESHED_OFFLINE_RESOURCES,
        id
      })

      dispatch(setNotification({
        message: `${name} updated.`
      }))
    } catch (error) {
      dispatch({
        type: types.FAILED_REFRESHING_OFFLINE_RESOURCES,
        id,
        error
      })

      dispatch(setNotification({
        level: 'error',
        message: `${name} could not be updated.`
      }))
    }
  }

  // skip when offline
  fn.interceptInOffline = true

  return fn
}

export function renameOfflineResource (id, name) {
  return {
    type: types.RENAME_OFFLINE_RESOURCE,
    id,
    name
  }
}

/**
 * @param {String<quadkey>} tile - quadkey whose data is being requested
 */
export function loadingDataForTile (tile) {
  return {
    type: types.LOADING_DATA_FOR_TILE,
    tile
  }
}

/**
 * @param {String<quadkey>} tile - quadkey whose data has been loaded
 * @param {boolean} offline - data is intended for offline use
 */
export function loadedDataForTile (tile, offline = false) {
  return {
    type: types.LOADED_DATA_FOR_TILE,
    tile,
    offline
  }
}

/**
 * @param {String<quadkey>} tile - quadkey whose data was being requested
 * @param {Error} err - error that occurred while requesting data
 */
export function failedLoadingDataForTile (tile, err) {
  return {
    type: types.FAILED_LOADING_DATA_FOR_TILE,
    err,
    tile
  }
}

/**
 * @param {String<quadkey>} tile - quadkey whose data was being requested
 */
export function requestedTile (tile, offline) {
  return {
    type: types.REQUESTED_TILE,
    tile,
    offline
  }
}

export function updateOfflineTile (tile, offline) {
  return {
    type: types.UPDATE_OFFLINE_TILE,
    tile,
    offline
  }
}

/**
 * Marks the given feature as "selected"
 * @param {Object<GeoJSON Feature>} feature
 */
export function setSelectedFeature (feature) {
  return {
    type: types.SET_SELECTED_FEATURE,
    feature: feature
  }
}

/**
 * Marks the given feature as "selected"
 * @param {Array<GeoJSON Features>} features
 */
export function setSelectedFeatures (features) {
  return {
    type: types.SET_SELECTED_FEATURES,
    features: features
  }
}

export function startAddPoint () {
  return {
    type: types.START_ADD_POINT
  }
}

export function mapBackPress () {
  return {
    type: types.MAP_BACK_PRESS
  }
}

export function setMapMode (mode) {
  return {
    type: types.SET_MAP_MODE,
    mode
  }
}

export function updateVisibleBounds (visibleBounds, zoom) {
  return async (dispatch, getState) => {
    dispatch({
      type: types.UPDATE_VISIBLE_BOUNDS,
      visibleBounds,
      zoom
    })

    const { map: { mode } } = getState()

    // there may be other modes in which we don't want to fetch data
    if (zoom >= 16 && mode !== 'bbox') {
      // load data
      await dispatch(fetchData(visibleBounds))

      const tiles = bboxToTiles(visibleBounds)

      // load data for all visible tiles into the cache (read by selectors.getVisibleFeatures)
      for (const tile of tiles) {
        try {
          if (!cache.has(tile)) {
            // insert a placeholder to avoid doing this multiple times
            cache.set(tile, false)
            const filename = `${RNFetchBlob.fs.dirs.DocumentDir}/${tile.slice(0, 8)}/${tile}.osm.xml`

            if (await RNFetchBlob.fs.exists(filename)) {
              const data = await RNFetchBlob.fs.readFile(filename, 'utf8')
              const xmlData = XML_PARSER.parseFromString(data, 'text/xml')
              const geoJSON = osmtogeojson(filterRelations(xmlData), {
                flatProperties: true,
                wayRefs: true
              })
              cache.set(tile, geoJSON)
              dispatch({
                type: types.NEW_DATA_AVAILABLE
              })
            } else {
              // OSM XML for this tile doesn't exist (yet)
              cache.del(tile)
            }
          }
        } catch (err) {
          console.warn(`Failed to hydrate tile ${tile}:`, err)
        }
      }
    }
  }
}

export function setBasemap (baseLayer) {
  return {
    type: types.SET_BASEMAP,
    baseLayer
  }
}

export function evictedTile (tile) {
  return {
    type: types.EVICTED_TILE,
    tile
  }
}
