/* eslint-disable no-dupe-keys */
import MapboxGL from '@react-native-mapbox-gl/maps'

const thinLineWidth = MapboxGL.StyleSheet.camera(
  {
    16: 3,
    20: 6
  }, MapboxGL.InterpolationMode.Interval
)

const standardLineWidth = MapboxGL.StyleSheet.camera(
  {
    16: 5,
    20: 8
  }, MapboxGL.InterpolationMode.Interval
)

const nodes = {
  circleRadius: 12,
  circleColor: 'brown',
  circleOpacity: 0.6
}

const lineHighlight = {
  lineWidth: MapboxGL.StyleSheet.camera(
    {
      16: 6,
      20: 9
    }
  ),
  lineColor: 'grey'
}

const editedLines = {
  lineWidth: MapboxGL.StyleSheet.camera(
    {
      16: 6,
      20: 9
    }
  ),
  lineColor: 'blue'
}

const highways = {
  lineWidth: standardLineWidth,
  lineColor: MapboxGL.StyleSheet.source(
    [
      ['primary', '#F99806'],
      ['primary_link', '#F99806'],
      ['secondary', '#F3F312'],
      ['secondary_link', '#F3F312'],
      ['tertiary', '#FFF9B3'],
      ['tertiary_link', '#FFF9B3'],
      ['motorway', '#58a9ed'],
      ['trunk', '#8cd05f'],
      ['unclassified', '#dca'],
      ['residential', '#fff'],
      ['service', '#fff'],
      ['road', '#9e9e9e'],
      ['track', '#eaeaea'],
      ['path', '#988']
    ],
    'highway',
    MapboxGL.InterpolationMode.Categorical
  )
}

const highwaysLower = {
  lineWidth: thinLineWidth,
  lineColor: MapboxGL.StyleSheet.source(
    [
      ['foot', '#988'],
      ['footway', '#988'],
      ['hiking', '#988'],
      ['living_street', '#988'],
      ['cycleway', '#58a9ed'],
      ['steps', '#81d25c']
    ],
    'highway',
    MapboxGL.InterpolationMode.Categorical
  ),
  lineDasharray: [2, 0, 0, 2]
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
  fillColor: MapboxGL.StyleSheet.source(
    [
      ['*', 'red']
    ],
    'building',
    MapboxGL.InterpolationMode.Identity
  ),
  fillOpacity: 0.6
}

const lineSelect = {
  lineWidth: MapboxGL.StyleSheet.camera(
    {
      10: 6,
      20: 10
    }
  ),
  lineColor: 'red',
  lineOpacity: 0.7

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
  iconImage: '{icon}',
  iconAllowOverlap: false,
  iconIgnorePlacement: false,
  iconSize: 0.8
}

const style = MapboxGL.StyleSheet.create({
  nodes: nodes,
  highways: highways,
  highwaysLower: highwaysLower,
  railwayLine: railwayLine,
  waterLine: waterLine,
  lineHighlight: lineHighlight,
  lineSelect: lineSelect,
  polygons: polygons,
  buildings: buildings,
  leisure: leisure,
  iconHalo: iconHalo,
  iconHaloSelected: iconHaloSelected,
  icons: icons,
  iconEditedHalo: iconEditedHalo,
  editedPolygons: editedPolygons,
  editedLines: editedLines
})

export default style
