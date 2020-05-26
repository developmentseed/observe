import { colors } from './variables'
/*
 * OSM FEATURES
 */

const thinLineWidth = [
  'interpolate', ['linear'],
  ['zoom'],
  16, 2,
  20, 5
]

const standardLineWidth = [
  'interpolate', ['linear'], ['zoom'],
  16, 4,
  20, 8
]

const nodes = {
  circleRadius: 12,
  circleColor: colors.base,
  circleOpacity: 0.6
}

const polygons = {
  fillOpacity: 0.1,
  fillColor: colors.baseMuted,
  fillOutlineColor: colors.baseMuted,
  visibility: 'none'
}

const lines = {
  lineWidth: thinLineWidth,
  lineColor: '#eaeaea',
  visibility: 'none'
}

const lineHighlight = {
  lineWidth: [
    'interpolate', ['linear'],
    ['zoom'],
    16, 6,
    20, 9
  ],
  lineColor: 'grey'
}

const editedLines = {
  lineWidth: [
    'interpolate', ['linear'],
    ['zoom'],
    16, 6,
    20, 9
  ],
  lineColor: colors.primary
}

const boundaries = {
  lineWidth: thinLineWidth,
  lineColor: '#985500',
  lineDasharray: [0, 4, 4, 0]
}

const highways = {
  lineWidth: standardLineWidth,
  lineColor: [
    'match',
    ['get', 'highway'],
    'primary', '#F99806',
    'primary_link', '#F99806',
    'secondary', '#F3F312',
    'secondary_link', '#F3F312',
    'tertiary', '#FFF9B3',
    'tertiary_link', '#FFF9B3',
    'motorway', '#58a9ed',
    'trunk', '#8cd05f',
    'unclassified', '#dca',
    'residential', '#fff',
    'service', '#fff',
    'road', '#9e9e9e',
    'track', '#eaeaea',
    'path', '#988',
    '#eaeaea'
  ]
}

const highwaysLower = {
  lineWidth: thinLineWidth,
  lineDasharray: [2, 0, 0, 2],
  lineColor: [
    'match',
    ['get', 'highway'],
    'foot', '#988',
    'footway', '#988',
    'hiking', '#988',
    'living_street', '#988',
    'cycleway', '#58a9ed',
    'steps', '#81d25c'
  ]
}

const railwayLine = {
  lineWidth: thinLineWidth,
  lineColor: '#555',
  lineDasharray: [2, 0, 0, 2]
}
const waterLine = {
  lineWidth: thinLineWidth,
  lineColor: '#7dd'
}

const waterFill = {
  fillColor: [
    'match',
    ['get', 'waterway'],
    'boatyard', '#30778b',
    'dam', '#677587',
    'fuel', '#4f4536',
    'dock', '#1e4d87',
    'riverbank', '#413b7e',
    '#0aa9da'
  ],
  fillOpacity: 0.3,
  fillOutlineColor: '#0f33a9'
}

const coastline = {
  lineWidth: thinLineWidth,
  lineColor: '#4fa3fd',
  lineDasharray: [0, 2, 2, 0]
}

const buildings = {
  fillColor: colors.base,
  fillOpacity: 0.2,
  fillOutlineColor: colors.base
}

const amenities = {
  fillColor: [
    'match',
    ['get', 'amenity'],
    'parking', colors.muted,
    'rgba(235, 225, 118, 0.3)'
  ],
  fillOutlineColor: colors.base
}

const editedPolygons = {
  fillColor: colors.secondary,
  fillOpacity: 0.2,
  fillOutlineColor: colors.secondary
}

const leisure = {
  fillColor: [
    'match',
    ['get', 'leisure'],
    'pitch', '#dca',
    '#3fbd30'
  ],
  fillOpacity: 0.3,
  fillOutlineColor: '#6fd02a'
}

const natural = {
  fillColor: [
    'match',
    ['get', 'natural'],
    'water', 'rgb(50,130,220)',
    'wood', 'rgb(110, 188, 75)',
    'beach', '#f0dd8a',
    '#a0ad5a'
  ],
  fillOpacity: 0.3,
  fillOutlineColor: '#0a42af'
}

/*
 * SELECTED FEATURES
 */

const selectedNode = {
  circleRadius: 6,
  circleOpacity: 1,
  circleColor: 'white',
  circleStrokeColor: colors.primary,
  circleStrokeWidth: 2,
  circleStrokeOpacity: 1
}

const selectedLine = {
  lineColor: colors.primary,
  lineOpacity: 0.7,
  lineWidth: thinLineWidth
}

/*
 * EDITING FEATURES
 */

const editingNodes = {
  circleColor: colors.secondary,
  circleRadius: 4,
  circleOpacity: 1,
  circleStrokeColor: 'white',
  circleStrokeWidth: 2,
  circleStrokeOpacity: 0.5
}

const editingLines = {
  lineWidth: thinLineWidth,
  lineColor: colors.secondary
}

const nearestNodes = {
  circleColor: 'white',
  circleRadius: 4,
  circleOpacity: 0.5,
  circleStrokeColor: colors.base,
  circleStrokeWidth: 2,
  circleStrokeOpacity: 0.5
}

const nearestLines = {
  lineWidth: thinLineWidth,
  lineColor: colors.secondary,
  lineOpacity: 0.5
}

/*
 * ICONS
 */

const iconHalo = {
  circleRadius: 12,
  circleColor: colors.primary,
  circleOpacity: 0.6,
  circleStrokeColor: 'white',
  circleStrokeWidth: 0.5
}

const iconEditedHalo = {
  circleRadius: 12,
  circleColor: colors.primary,
  circleOpacity: 1,
  circleStrokeColor: 'white',
  circleStrokeWidth: 0.5
}

const iconHaloSelected = {
  circleRadius: 12,
  circleColor: colors.primary,
  circleOpacity: 0.6,
  circleStrokeColor: colors.primary,
  circleStrokeWidth: 4,
  circleStrokeOpacity: 0.6
}

const icons = {
  iconImage: ['get', 'icon'],
  iconAllowOverlap: false,
  iconIgnorePlacement: false,
  iconSize: 0.8
}

/*
 * TRACES
 */

const traces = {
  lineWidth: [
    'interpolate', ['linear'],
    ['zoom'],
    16, 1,
    20, 3
  ],
  lineColor: 'red',
  visibility: 'none'
}

/*
 * PHOTOS
 */

const photoIcon = {
  iconImage: 'maki_attraction',
  iconAllowOverlap: false,
  iconIgnorePlacement: false,
  iconSize: 0.8,
  visibility: 'none'
}

const photoIconHalo = {
  circleRadius: 12,
  circleColor: 'blue',
  circleOpacity: 0.6,
  circleStrokeColor: 'white',
  circleStrokeWidth: 0.5,
  visibility: 'none'
}

const photoIconSelected = {
  circleRadius: 15,
  circleColor: 'brown',
  circleOpacity: 0.6,
  circleStrokeColor: 'blue',
  circleStrokeWidth: 2,
  circleStrokeOpacity: 0.6,
  visibility: 'none'
}

export default {
  osm: {
    lines,
    nodes,
    boundaries,
    highways,
    highwaysLower,
    railwayLine,
    waterLine,
    waterFill,
    lineHighlight,
    selectedLine,
    polygons,
    buildings,
    amenities,
    coastline,
    natural,
    leisure,
    iconHalo,
    iconHaloSelected,
    icons,
    iconEditedHalo,
    editedPolygons,
    editedLines,
    editingWay: {
      nodes: editingNodes,
      lines: editingLines,
      nearestFeatures: {
        nodes: nearestNodes,
        lines: nearestLines
      }
    },
    selectedFeatures: {
      nodes: selectedNode,
      lines: selectedLine
    }
  },
  traces: {
    traces
  },
  photos: {
    photoIcon,
    photoIconHalo,
    photoIconSelected
  }
}
