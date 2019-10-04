const thinLineWidth = [
  'step',
  ['zoom'],
  16, 3,
  20, 6
]

const standardLineWidth = [
  'step', ['zoom'],
  16, 5,
  20, 8
]

const nodes = {
  circleRadius: 12,
  circleColor: 'brown',
  circleOpacity: 0.6
}

const lineHighlight = {
  lineWidth: [
    'step',
    ['zoom'],
    16, 6,
    20, 9
  ],
  lineColor: 'grey'
}

const editedLines = {
  lineWidth: [
    'step',
    ['zoom'],
    16, 6,
    20, 9
  ],
  lineColor: 'blue'
}

const highways = {
  lineWidth: standardLineWidth,
  lineColor: '#F99806'
  // lineColor: [
  //   'step',
  //   ['get', 'highway'],
  //   '#F99806', 'primary',
  //   '#F99806', 'primary_link',
  //   '#F3F312', 'secondary',
  //   '#F3F312', 'secondary_link',
  //   '#FFF9B3', 'tertiary',
  //   '#FFF9B3', 'tertiary_link',
  //   '#58a9ed', 'motorway',
  //   '#8cd05f', 'trunk',
  //   '#dca', 'unclassified',
  //   '#fff', 'residential',
  //   '#fff', 'service',
  //   '#9e9e9e', 'road',
  //   '#eaeaea', 'track',
  //   '#988', 'path',
  //   '#F99806'
  // ]
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
    'step',
    ['zoom'],
    10, 6,
    20, 10
  ]
}

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

export default {
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
  editedLines
}
