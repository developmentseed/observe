/* global describe */
/* global it */
/* global expect */

import reducer from '../../app/reducers/map'
import { featureCollection } from '@turf/helpers'
import { getFeature } from '../test-utils'

function getInitialState () {
  return {
    activeTileRequests: new Set(),
    fetchedTiles: {},
    mode: 'explore',
    visibleBounds: [[-180, -90, 180, 90]]
  }
}

const mockFeature1 = getFeature('node/1')
const mockFeature2 = getFeature('node/2')
const mockFeature3 = getFeature('node/3')

describe('map reducer', () => {
  it('should append to fetchedTiles on LOADED_DATA_FOR_TILE', () => {
    const mockState = {
      ...getInitialState(),
      fetchedTiles: {
        '01': {
          data: featureCollection([mockFeature1])
        },
        '10': {
          data: featureCollection([mockFeature2])
        }
      }
    }

    const action = {
      type: 'LOADED_DATA_FOR_TILE',
      tile: '02',
      data: featureCollection([mockFeature1, mockFeature3])
    }

    const newState = reducer(mockState, action)
    expect(Object.keys(newState.fetchedTiles).length).toEqual(3)
  })

  it('should set mode to add on START_ADD_POINT', () => {
    const mockState = getInitialState()
    const action = {
      type: 'START_ADD_POINT'
    }
    const newState = reducer(mockState, action)
    expect(newState.mode).toEqual('add')
  })

  it('should set mode to explore on MAP_BACK_PRESS', () => {
    const mockState = {
      ...getInitialState(),
      mode: 'add'
    }
    const action = {
      type: 'MAP_BACK_PRESS'
    }
    const newState = reducer(mockState, action)
    expect(newState.mode).toEqual('explore')
  })
})
