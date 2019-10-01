import tileCover from '@mapbox/tile-cover'
import bboxPolygon from '@turf/bbox-polygon'
import turfBbox from '@turf/bbox'
import turfBuffer from '@turf/buffer'
import _flatten from 'lodash.flatten'

// TODO - move this to an appropriate config file
const tileLimits = {
  min_zoom: 16,
  max_zoom: 16
}

/**
 * Convert map bbox object to a string
 * @param {*} bbox
 * @return string
 */
export function bboxToString (bbox) {
  const ne = bbox[0]
  const sw = bbox[1]
  const left = sw[0]
  const bottom = sw[1]
  const right = ne[0]
  const top = ne[1]
  return [left, bottom, right, top].join(',')
}

export function bboxToTiles (bbox) {
  const polygon = bboxPolygon(_flatten(bbox))
  const tiles = tileCover.indexes(polygon.geometry, tileLimits)
  return tiles
}

export function featureToTiles (feature) {
  let bbox = []
  if (feature.geometry && feature.geometry.type === 'Point') {
    const buffer = turfBuffer(feature, '0.0005', { 'units': 'kilometers' })
    bbox = turfBbox(buffer)
  } else {
    bbox = turfBbox(feature)
  }
  const polygon = bboxPolygon(bbox)
  const tiles = tileCover.indexes(polygon.geometry, tileLimits)
  return tiles
}
