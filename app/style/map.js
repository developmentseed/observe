/*
 * OSM FEATURES
 */

const thinLineWidth = [
  'interpolate', ['linear'],
  ['zoom'],
  16, 3,
  20, 6
]

const standardLineWidth = [
  'interpolate', ['linear'], ['zoom'],
  16, 4,
  20, 8
]

const nodes = {
  circleRadius: 12,
  circleColor: 'brown',
  circleOpacity: 0.6
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
  lineColor: 'blue'
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
    'step',
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

const buildings = {
  fillColor: 'red',
  fillOpacity: 0.3,
  fillOutlineColor: 'grey'
}

const editedPolygons = {
  fillColor: 'blue',
  fillOpacity: 0.3,
  fillOutlineColor: 'blue'
}

const leisure = {
  fillColor: 'rgba(140, 208, 95, 0.3)',
  fillOutlineColor: 'grey'
}

const polygons = {
  fillOpacity: 0.6,
  fillColor: [
    'step',
    ['get', 'building'],
    'red'
  ]
}

const lineSelect = {
  lineColor: 'red',
  lineOpacity: 0.7,
  lineWidth: [
    'interpolate', ['linear'],
    ['zoom'],
    10, 6,
    20, 10
  ]
}

/*
 * EDITING FEATURES
 */

const editingNodes = {
  circleColor: 'red',
  circleRadius: 9,
  circleOpacity: 1
}

const editingLines = {
  lineWidth: thinLineWidth,
  lineColor: 'red'
}

/*
 * ICONS
 */

const iconHalo = {
  circleRadius: 12,
  circleColor: 'brown',
  circleOpacity: 0.6,
  circleStrokeColor: 'white',
  circleStrokeWidth: 0.5
}

const iconEditedHalo = {
  circleRadius: 12,
  circleColor: 'blue',
  circleOpacity: 0.6,
  circleStrokeColor: 'white',
  circleStrokeWidth: 0.5
}

const iconHaloSelected = {
  circleRadius: 15,
  circleColor: 'brown',
  circleOpacity: 0.6,
  circleStrokeColor: 'blue',
  circleStrokeWidth: 2,
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
    nodes,
    highways,
    highwaysLower,
    railwayLine,
    waterLine,
    lineHighlight,
    lineSelect,
    polygons,
    buildings,
    leisure,
    iconHalo,
    iconHaloSelected,
    icons,
    iconEditedHalo,
    editedPolygons,
    editedLines,
    editingWay: {
      nodes: editingNodes,
      lines: editingLines
    },
    nearestFeatures: {
      nodes: editingNodes,
      lines: {
        ...editingLines,
        lineColor: 'pink'
      }
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
