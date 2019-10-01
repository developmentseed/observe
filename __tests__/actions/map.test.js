/* global fetch */
/* global describe */
/* global it */
/* global jest */
/* global expect */
/* global console */
/* global process */

import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

import RNFetchBlob from 'rn-fetch-blob'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  fetchDataForTile,
  loadedDataForTile,
  setSelectedFeature,
  mapBackPress,
  startAddPoint
} from '../../app/actions/map'
import { getFeature } from '../test-utils'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)
const nextTick = promisify(process.nextTick)
const xmlData = fs.readFileSync(path.join(__dirname, '../fixtures/osm-xml-for-bbox.xml'), 'utf-8')

const mockFeature1 = getFeature('node/1')

describe('test sync map actions', () => {
  it('should set data for tile loaded', () => {
    const store = mockStore({})
    store.dispatch(loadedDataForTile('01'))
    const actions = store.getActions()
    const expectedPayload = {
      type: 'LOADED_DATA_FOR_TILE',
      tile: '01',
      offline: false
    }
    expect(actions[0]).toEqual(expectedPayload)
  })

  it('should set selected feature', () => {
    const store = mockStore({})
    store.dispatch(setSelectedFeature(mockFeature1))
    const actions = store.getActions()
    expect(actions[0]).toEqual({
      type: 'SET_SELECTED_FEATURE',
      feature: mockFeature1
    })
  })

  it('should MAP_BACK_PRESS', () => {
    const store = mockStore({})
    store.dispatch(mapBackPress())
    const actions = store.getActions()
    expect(actions[0]).toEqual({
      type: 'MAP_BACK_PRESS'
    })
  })

  it('should START_ADD_POINT', () => {
    const store = mockStore({})
    store.dispatch(startAddPoint())
    const actions = store.getActions()
    expect(actions[0]).toEqual({
      type: 'START_ADD_POINT'
    })
  })
})

describe('test async map actions', () => {
  it('should fetch data correctly for single tile', async () => {
    const store = mockStore({
      map: {
        activeTileRequests: [],
        fetchedTiles: {},
        pendingEviction: []
      }
    })
    RNFetchBlob.config = jest.fn(cfg => ({
      fetch: jest.fn((method, url, headers) => ({
        info: jest.fn(x => ({
          status: 200
        })),
        path: jest.fn(x => '/nonexistent')
      }))
    }))
    RNFetchBlob.fs.stat = jest.fn(p => ({
      size: 42
    }))
    RNFetchBlob.fs.mv = jest.fn(() => Promise.resolve())
    await fetchDataForTile('01')(store.dispatch, store.getState)
    const actions = store.getActions()
    expect(actions.length).toBe(4)
    expect(actions[0].type).toEqual('REQUESTED_TILE')
    expect(actions[0].tile).toEqual('01')
    expect(actions[1].type).toEqual('LOADING_DATA_FOR_TILE')
    expect(actions[1].tile).toEqual('01')
    expect(actions[2].type).toEqual('LOADED_DATA_FOR_TILE')
    expect(actions[2].tile).toEqual('01')
  })

  it('should not refetch data for tiles already requested', async () => {
    // Test re-fetching tiles
    const store = mockStore({
      map: {
        activeTileRequests: ['01', '10'],
        fetchedTiles: {},
        pendingEviction: []
      }
    })
    fetch.mockResponse(xmlData)
    await fetchDataForTile('10')(store.dispatch, store.getState)
    await fetchDataForTile('11')(store.dispatch, store.getState)
    let actions = store.getActions()
    expect(actions[2]).toEqual({
      type: 'LOADING_DATA_FOR_TILE',
      tile: '11'
    })

    await nextTick()
    actions = store.getActions()
    expect(actions.length).toBe(5)
    expect(actions[3].tile).toEqual('11')
  })
})
