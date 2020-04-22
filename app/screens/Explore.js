import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import { Platform } from 'react-native'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { AndroidBackHandler } from 'react-navigation-backhandler'
import Config from 'react-native-config'
import { NavigationEvents } from 'react-navigation'
import _partition from 'lodash.partition'
import _difference from 'lodash.difference'
import _isEqual from 'lodash.isequal'

import {
  loadUserDetails
} from '../actions/account'

import {
  fetchData,
  setSelectedFeatures,
  mapBackPress,
  startAddPoint,
  setMapMode,
  updateVisibleBounds,
  setBasemap,
  setSelectedPhotos
} from '../actions/map'

import {
  setAddPointGeometry,
  addFeature,
  uploadEdits
} from '../actions/edit'

import {
  setSelectedNode
} from '../actions/wayEditing'

import {
  setNotification
} from '../actions/notification'

import {
  startTrace,
  pauseTrace,
  unpauseTrace,
  endTrace
} from '../actions/traces'

import { bboxToTiles } from '../utils/bbox'
import Header from '../components/Header'
import MapOverlay from '../components/MapOverlay'
import MegaMenu from '../components/MegaMenu'
import AddPointOverlay from '../components/AddPointOverlay'
import LoadingOverlay from '../components/LoadingOverlay'
import ZoomToEdit from '../components/ZoomToEdit'
import getRandomId from '../utils/get-random-id'
import LocateUserButton from '../components/LocateUserButton'
import AuthMessage from '../components/AuthMessage'
import WayEditingOverlay from '../components/WayEditingOverlay'
import getUserLocation from '../utils/get-user-location'
import {
  getVisibleBounds,
  getVisibleFeatures,
  getZoom,
  isLoadingData,
  getIsTracing,
  getCurrentTraceGeoJSON,
  getCurrentTraceLength,
  getCurrentTraceStatus,
  getTracesGeojson,
  getPhotosGeojson,
  getVisibleTiles
} from '../selectors'
import BasemapModal from '../components/BasemapModal'
import Icon from '../components/Collecticons'
import { colors } from '../style/variables'

import icons from '../assets/icons'
import { authorize } from '../services/auth'

import { modes, modeTitles } from '../utils/map-modes'

let osmStyleURL = Config.MAPBOX_STYLE_URL || MapboxGL.StyleURL.Street
let satelliteStyleURL = Config.MAPBOX_SATELLITE_STYLE_URL || MapboxGL.StyleURL.Satellite

// fix asset URLs for Android
if (!osmStyleURL.includes(':/') && Platform.OS === 'android') {
  osmStyleURL = `asset://${osmStyleURL}`
}

if (!satelliteStyleURL.includes(':/') && Platform.OS === 'android') {
  satelliteStyleURL = `asset://${satelliteStyleURL}`
}

const Container = styled.View`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
`
const MainBody = styled.View`
  flex: 1;
  position: relative;
  background-color: white;
`
const MainHeader = styled(Header)`

`

const StyledMap = styled(MapboxGL.MapView)`
  flex: 1;
  width: 100%;
`

class Explore extends React.Component {
  static whyDidYouRender = true

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLabel: 'Explore',
      drawerIcon: () => (
        <Icon
          name='compass'
          style={{ fontSize: 16, color: colors.primary }}
        />
      )
    }
  }

  constructor (props) {
    super(props)

    this.state = {
      androidPermissionGranted: false,
      isMapLoaded: false,
      userTrackingMode: MapboxGL.UserTrackingModes.Follow
    }
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.navigation.isFocused()
  }

  componentWillUpdate (nextProps) {
    const { isConnected, visibleBounds, zoom } = this.props
    if (!isConnected && nextProps.isConnected) {
      // just went online
      this._fetchData(visibleBounds, zoom)
    }
  }

  onDidFinishRenderingMapFully = async () => {
    this.setState({
      isMapLoaded: true,
      clickableLayers: ['editedPois', 'pois', 'editedPolygons',
        'buildings', 'roads', 'roadsLower',
        'railwayLine', 'waterLine', 'leisure', 'photos'],
      userTrackingMode: MapboxGL.UserTrackingModes.None
    })

    const visibleBounds = await this.mapRef.getVisibleBounds()
    const zoomLevel = await this.mapRef.getZoom()

    this.props.updateVisibleBounds(visibleBounds, zoomLevel)
  }

  onWillFocus = payload => {
    if (payload.action.params && payload.action.params.mode) {
      this.props.setMapMode(payload.action.params.mode)
    }
    // TODO: handle payload.actions.params.message
  }

  onDidFocus = () => {
    const { requiresPreauth } = this.props

    if (!requiresPreauth) {
      this.forceUpdate()
      this.locateUser()
    }
  }

  onWillStartLoadingMap = () => {
    this.setState({
      isMapLoaded: false
    })

    if (
      Platform.OS === 'android' &&
      Platform.Version >= 23 &&
      !this.state.androidPermissionGranted
    ) {
      this.locateUser()
    }
  }

  onDidFailLoadingMap = err => {
    console.log('onDidFailLoadingMap', err)
  }

  _fetchData (visibleBounds, zoomLevel) {
    // fetch new data only if zoom is greater than 16
    if (zoomLevel >= 16) {
      this.props.fetchData(visibleBounds)
    }
  }

  onRegionDidChange = evt => {
    const { properties: { visibleBounds, zoomLevel } } = evt
    const oldBounds = this.props.visibleBounds
    if (oldBounds && oldBounds.length) {
      const oldTiles = bboxToTiles(oldBounds)
      const currentTiles = bboxToTiles(visibleBounds)
      if (_difference(oldTiles, currentTiles).length === 0) return
    }
    this.props.updateVisibleBounds(visibleBounds, zoomLevel)
  }

  onPress = async (e) => {
    const { mode } = this.props

    const screenBbox = this.getBoundingBox([e.properties.screenPointX, e.properties.screenPointY])

    if (mode === modes.ADD_WAY || mode === modes.EDIT_WAY) {
      const { features } = await this.mapRef.queryRenderedFeaturesInRect(screenBbox, null, ['nodes'])
      this.props.setSelectedNode(features[0])
    } else {
      this.loadFeaturesAtPoint(screenBbox)
    }
  }

  onUserLocationUpdate = location => {
    // console.log('user location updated', location)
  }

  async locateUser () {
    try {
      const userLocation = await getUserLocation()
      if (userLocation.hasOwnProperty('coords')) {
        const centerCoordinate = [userLocation.coords.longitude, userLocation.coords.latitude]

        this.cameraRef && this.cameraRef.setCamera({
          centerCoordinate,
          zoomLevel: 18
        })

        this.setState({ centerCoordinate })
      }
    } catch (error) {
      console.log('error fetching user location', error)
    }
  }

  async loadFeaturesAtPoint (rect) {
    try {
      const { features } = await this.mapRef.queryRenderedFeaturesInRect(rect, null, this.state.clickableLayers)
      const [ photos, osmFeatures ] = _partition(features, (f) => { return f.properties.type === 'photo' })
      const { selectedPhotos, selectedFeatures } = this.props
      if (!_isEqual(osmFeatures, selectedFeatures)) {
        this.props.setSelectedFeatures(osmFeatures)
      }
      if (!_isEqual(photos, selectedPhotos)) {
        this.props.setSelectedPhotos(photos)
      }
    } catch (err) {
      console.log('failed getting features', err)
    }
  }

  getBoundingBox (screenCoords) {
    const maxX = screenCoords[0] + 3
    const minX = screenCoords[0] - 3
    const maxY = screenCoords[1] + 3
    const minY = screenCoords[1] - 3
    return [maxY, maxX, minY, minX]
  }

  getFeatureType (feature) {
    return feature.id.split('/')[0]
  }

  onAddButtonPress = () => {
    this.props.startAddPoint()
  }

  onAddConfirmPress = async () => {
    const center = await this.mapRef.getCenter()
    const featureId = `node/${getRandomId()}`
    const feature = {
      type: 'Feature',
      id: featureId,
      geometry: {
        type: 'Point',
        coordinates: center
      },
      properties: {
        id: featureId,
        version: 1
      }
    }

    this.props.navigation.navigate('SelectFeatureType', { feature })
  }

  onEditConfirmPress = async () => {
    const feature = this.props.navigation.state.params.feature
    const newCoords = await this.mapRef.getCenter()
    this.props.navigation.navigate('EditFeatureDetail', { feature, newCoords })
  }

  onBackButtonPress = () => {
    const { mode } = this.props
    if (mode === modes.EXPLORE) { // let default back handling happen when in Explore mode
      return false
    }
    this.props.mapBackPress()
    return true
  }

  renderZoomToEdit () {
    const { zoom } = this.props

    if (!zoom || zoom >= 16) return null

    return (
      <ZoomToEdit onPress={() => {
        this.cameraRef.zoomTo(16.5)
      }} />
    )
  }

  getBackButton = () => {
    const { navigation, mode } = this.props
    const useBackButtonPress = (
      mode === modes.ADD_POINT ||
      mode === modes.EDIT_POINT ||
      mode === modes.ADD_WAY ||
      mode === modes.EDIT_WAY
    )

    switch (true) {
      case navigation.getParam('back'):
        return navigation.getParam('back')
      case useBackButtonPress:
        return this.onBackButtonPress
      case mode === modes.OFFLINE_TILES:
        return 'OfflineMaps'
      default:
        return false
    }
  }

  getTitle = () => {
    const { navigation, mode } = this.props
    const title = navigation.getParam('title') || modeTitles[mode]
    if (!title) return 'Observe'
    return title
  }

  onRecordPress = () => {
    const { currentTraceStatus, startTrace, pauseTrace, unpauseTrace } = this.props
    switch (currentTraceStatus) {
      case 'none':
        startTrace()
        break
      case 'paused':
        unpauseTrace()
        break
      case 'recording':
        pauseTrace()
        break
      default:
        console.error('invalid current trace status')
    }
  }

  renderAuthPrompt () {
    return (
      <AuthMessage onPress={async () => {
        await authorize()
        await this.props.loadUserDetails()
        this.locateUser()
      }} />
    )
  }

  async getMapCenter () {
    return this.mapRef.getCenter()
  }

  renderOverlay () {
    const { navigation, geojson, mode, currentTraceStatus } = this.props

    if (mode === modes.OFFLINE_TILES) {
      return null
    }

    if (mode === modes.ADD_POINT || mode === modes.EDIT_POINT) {
      return <AddPointOverlay
        onAddConfirmPress={this.onAddConfirmPress}
      />
    }

    if (mode === modes.ADD_WAY || mode === modes.EDIT_WAY) {
      return <WayEditingOverlay
        mode={mode}
        navigation={navigation}
        getMapCenter={async () => {
          return this.getMapCenter()
        }}
      />
    }

    // if not in explicit mode, render default MapOverlay

    return (
      <>
        <MapOverlay
          features={geojson.features}
          onAddButtonPress={this.onAddButtonPress}
          navigation={navigation}
        />
        <MegaMenu
          onCameraPress={() => navigation.navigate('CameraScreen', { previousScreen: 'Explore', feature: null })}
          onRecordPress={() => this.onRecordPress()}
          onWayPress={() => { this.props.setMapMode(modes.ADD_WAY) }}
          onPointPress={() => { this.onAddButtonPress() }}
          recordStatus={currentTraceStatus}
        />
      </>
    )
  }

  render () {
    const {
      navigation,
      geojson,
      selectedFeatures,
      editsGeojson,
      mode,
      currentTrace,
      isConnected,
      requiresPreauth,
      tracesGeojson,
      style,
      photosGeojson,
      selectedPhotos,
      nodesGeojson,
      currentWayEdit
    } = this.props
    let selectedFeatureIds = null
    let selectedPhotoIds = null

    if (selectedFeatures && selectedFeatures.length) {
      selectedFeatureIds = {
        'nodes': ['match', ['get', 'id'], [], true, false],
        'ways': ['match', ['get', 'id'], [], true, false]
      }
      selectedFeatures.reduce((selectedFeatureIds, currentFeature) => {
        this.getFeatureType(currentFeature) === 'node' ? selectedFeatureIds.nodes[2].push(currentFeature.id) : selectedFeatureIds.ways[2].push(currentFeature.id)
        return selectedFeatureIds
      }, selectedFeatureIds)
    }

    if (selectedPhotos && selectedPhotos.length) {
      selectedPhotoIds = ['match', ['get', 'id'], [], true, false]
      selectedPhotos.reduce((selectedPhotoIds, photo) => {
        selectedPhotoIds[2].push(photo.properties.id)
        return selectedPhotoIds
      }, selectedPhotoIds)
    }

    let filteredFeatureIds = null
    if (editsGeojson.features.length) {
      filteredFeatureIds = {
        'nodes': ['match', ['get', 'id'], [], false, true],
        'ways': ['match', ['get', 'id'], [], false, true]
      }

      editsGeojson.features.reduce((filteredFeatureIds, feature) => {
        this.getFeatureType(feature) === 'node' ? filteredFeatureIds.nodes[2].push(feature.id) : filteredFeatureIds.ways[2].push(feature.id)
        return filteredFeatureIds
      }, filteredFeatureIds)
    }

    let styleURL
    switch (this.props.baseLayer) {
      case 'satellite':
        styleURL = satelliteStyleURL
        break

      default:
        styleURL = osmStyleURL
    }

    let showLoadingIndicator = null
    if (this.props.loadingData) {
      showLoadingIndicator = (
        <LoadingOverlay />
      )
    }

    const filters = {
      allRoads: [
        'all',
        ['==', ['geometry-type'], 'LineString']
      ],
      railwayLine: [
        'all',
        ['has', 'railway'],
        ['==', ['geometry-type'], 'LineString']
      ],
      waterLine: [
        'all',
        ['has', 'waterway'],
        ['==', ['geometry-type'], 'LineString']
      ],
      buildings: [
        'all',
        ['has', 'building'],
        filteredFeatureIds && filteredFeatureIds.ways[2].length ? filteredFeatureIds.ways : ['match', ['get', 'id'], [''], false, true]
      ],
      leisure: [
        'any',
        [
          'match',
          ['get', 'leisure'],
          ['pitch', 'track', 'garden'],
          true, false
        ],
        [
          'match',
          ['get', 'natural'],
          'wood',
          true, false
        ],
        [
          'match',
          ['get', 'landuse'],
          ['grass', 'forest'],
          true, false
        ]
      ],
      iconHalo: [
        'all',
        [
          '==',
          ['geometry-type'], 'Point'
        ],
        filteredFeatureIds && filteredFeatureIds.nodes[2].length ? filteredFeatureIds.nodes : ['match', ['get', 'id'], [''], false, true]
      ],
      iconHaloSelected: [
        'all',
        [
          '==',
          ['geometry-type'], 'Point'
        ],
        selectedFeatureIds && selectedFeatureIds.nodes[2].length ? selectedFeatureIds.nodes : ['==', ['get', 'id'], ''],
        filteredFeatureIds && filteredFeatureIds.nodes[2].length ? filteredFeatureIds.nodes : ['match', ['get', 'id'], [''], false, true]
      ],
      pois: [
        'all',
        [
          'has', 'icon'
        ],
        ['==', ['geometry-type'], 'Point'],
        filteredFeatureIds && filteredFeatureIds.nodes[2].length ? filteredFeatureIds.nodes : ['match', ['get', 'id'], [''], false, true]
      ],
      featureSelect: [
        'all',
        selectedFeatureIds && selectedFeatureIds.ways[2].length ? selectedFeatureIds.ways : ['==', ['get', 'id'], ''],
        filteredFeatureIds && filteredFeatureIds.ways[2].length ? filteredFeatureIds.ways : ['match', ['get', 'id'], [''], false, true]
      ],
      editedPolygons: ['==', ['geometry-type'], 'Polygon'],
      editedLines: ['==', ['geometry-type'], 'LineString'],
      editedPois: [
        'all',
        ['has', 'icon'],
        ['==', ['geometry-type'], 'Point']
      ],
      editedIconHaloSelected: [
        'all',
        [
          '==',
          ['geometry-type'], 'Point'
        ],
        selectedFeatureIds && selectedFeatureIds.nodes[2].length ? selectedFeatureIds.nodes : ['==', ['get', 'id'], '']
      ],
      photosHaloSelected: selectedPhotoIds && selectedPhotoIds.length ? selectedPhotoIds : ['==', ['get', 'id'], '']
    }

    return (
      <AndroidBackHandler onBackPress={() => this.onBackButtonPress()}>
        <NavigationEvents
          onWillFocus={this.onWillFocus}
          onDidFocus={this.onDidFocus}
          onWillBlur={payload => {
            if (payload.state.params && payload.state.params.mode === modes.OFFLINE_TILES) {
              // reset params once this screen has been used in bbox mode
              navigation.setParams({
                back: null,
                mode: modes.EXPLORE,
                title: null,
                actions: null
              })

              // reset map mode
              this.props.setMapMode(modes.EXPLORE)
            }
          }}
        />
        <Container>
          <MainHeader
            actions={navigation.getParam('actions', [])}
            back={this.getBackButton()}
            navigation={navigation}
            title={this.getTitle()}
          />
          <MainBody>
            {
              (requiresPreauth && isConnected)
                ? this.renderAuthPrompt()
                : (
                  <StyledMap
                    styleURL={styleURL}
                    ref={(ref) => { this.mapRef = ref }}
                    onDidFinishRenderingMapFully={this.onDidFinishRenderingMapFully}
                    onWillStartLoadingMap={this.onWillStartLoadingMap}
                    onDidFailLoadingMap={this.onDidFailLoadingMap}
                    onRegionDidChange={this.onRegionDidChange}
                    regionDidChangeDebounceTime={10}
                    onPress={this.onPress}
                  >
                    <MapboxGL.Camera
                      zoomLevel={12}
                      maxZoomLevel={19}
                      defaultSettings={{
                        centerCoordinate: [0, 0],
                        zoomLevel: 12
                      }}
                      animationDuration={0}
                      animationMode={'moveTo'}
                      ref={(ref) => { this.cameraRef = ref }}
                    />
                    <MapboxGL.UserLocation
                      minDisplacement={5}
                    />
                    <MapboxGL.Images images={icons} />
                    <MapboxGL.ShapeSource id='geojsonSource' shape={geojson}>
                      <MapboxGL.LineLayer id='roadsHighlight' filter={filters.allRoads} style={style.osm.lineHighlight} minZoomLevel={16} />
                      <MapboxGL.LineLayer id='roads' filter={filters.allRoads} style={style.osm.highways} minZoomLevel={16} />
                      <MapboxGL.LineLayer id='railwayLine' filter={filters.railwayLine} minZoomLevel={16} />
                      <MapboxGL.LineLayer id='waterLine' filter={filters.waterLine} style={style.osm.waterLine} minZoomLevel={16} />
                      <MapboxGL.FillLayer id='buildings' filter={filters.buildings} style={style.osm.buildings} minZoomLevel={16} />
                      <MapboxGL.FillLayer id='leisure' filter={filters.leisure} style={style.osm.leisure} minZoomLevel={16} />
                      <MapboxGL.LineLayer id='featureSelect' filter={filters.featureSelect} style={style.osm.lineSelect} minZoomLevel={16} />
                      <MapboxGL.CircleLayer id='iconHalo' style={style.osm.iconHalo} minZoomLevel={16} filter={filters.iconHalo} />
                      <MapboxGL.CircleLayer id='iconHaloSelected' style={style.osm.iconHaloSelected} minZoomLevel={16} filter={filters.iconHaloSelected} />
                      <MapboxGL.SymbolLayer id='pois' style={style.osm.icons} filter={filters.pois} />
                    </MapboxGL.ShapeSource>
                    <MapboxGL.ShapeSource id='editGeojsonSource' shape={editsGeojson}>
                      <MapboxGL.FillLayer id='editedPolygons' filter={filters.editedPolygons} style={style.osm.editedPolygons} minZoomLevel={16} />
                      <MapboxGL.CircleLayer id='editedIconHalo' style={style.osm.iconEditedHalo} minZoomLevel={16} filter={filters.editedPois} />
                      <MapboxGL.CircleLayer id='editedIconHaloSelected' style={style.osm.iconHaloSelected} minZoomLevel={16} filter={filters.editedIconHaloSelected} />
                      <MapboxGL.LineLayer id='editedLines' filter={filters.editedLines} style={style.osm.editedLines} minZoomLevel={16} />
                      <MapboxGL.SymbolLayer id='editedPois' style={style.osm.icons} filter={filters.editedPois} />
                    </MapboxGL.ShapeSource>
                    <MapboxGL.ShapeSource id='tracesGeojsonSource' shape={tracesGeojson}>
                      <MapboxGL.LineLayer id='traces' style={style.traces.traces} minZoomLevel={16} />
                    </MapboxGL.ShapeSource>
                    <MapboxGL.ShapeSource id='currentTraceGeojsonSource' shape={currentTrace}>
                      <MapboxGL.LineLayer id='currentTrace' style={style.traces.traces} minZoomLevel={16} />
                    </MapboxGL.ShapeSource>
                    <MapboxGL.ShapeSource id='photoGeojsonSource' shape={photosGeojson}>
                      <MapboxGL.CircleLayer id='photosHaloSelected' style={style.photos.photoIconSelected} filter={filters.photosHaloSelected} minZoomLevel={16} />
                      <MapboxGL.CircleLayer id='photosHalo' style={style.photos.photoIconHalo} minZoomLevel={16} />
                      <MapboxGL.SymbolLayer id='photos' style={style.photos.photoIcon} minZoomLevel={16} />
                    </MapboxGL.ShapeSource>
                    <MapboxGL.ShapeSource id='currentWayEdit' shape={currentWayEdit}>
                      <MapboxGL.LineLayer id='currentWayLine' style={style.osm.editedLines} minZoomLevel={16} />
                    </MapboxGL.ShapeSource>
                    <MapboxGL.ShapeSource id='nodesGeojsonSource' shape={nodesGeojson}>
                      {/* // TODO: finish style/filter for selected node in a way that's being edited */}
                      <MapboxGL.CircleLayer id='nodeHaloSelected' style={style.photos.nodeIconSelected} filter={filters.nodeHaloSelected} minZoomLevel={16} />
                      <MapboxGL.CircleLayer id='nodes' style={style.osm.nodes} minZoomLevel={16} />
                    </MapboxGL.ShapeSource>
                  </StyledMap>
                )
            }
            {/* should hide this entire element when not in loading state */}
            { showLoadingIndicator }
            <LocateUserButton onPress={() => this.locateUser()} />
            <BasemapModal onChange={this.props.setBasemap} />
            {mode !== modes.OFFLINE_TILES && this.renderZoomToEdit()}
          </MainBody>
          { this.renderOverlay() }
        </Container>
      </AndroidBackHandler>
    )
  }
}

const mapStateToProps = (state) => {
  const { userDetails } = state.account

  const currentWayEdit = {
    type: 'FeatureCollection',
    properties: {},
    features: []
  }

  let nodes
  if (state.wayEditingHistory.present.way && state.wayEditingHistory.present.way.nodes && state.wayEditingHistory.present.way.nodes.length) {
    currentWayEdit.features.push({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: state.wayEditingHistory.present.way.nodes.map((point) => {
          return point.geometry.coordinates
        })
      }
    })

    nodes = {
      type: 'FeatureCollection',
      properties: {},
      features: state.wayEditingHistory.present.way.nodes
    }
  } else {
    nodes = state.map.nodes
  }

  return {
    geojson: getVisibleFeatures(state),
    isTracing: getIsTracing(state),
    currentTrace: getCurrentTraceGeoJSON(state),
    currentTraceLength: getCurrentTraceLength(state),
    currentTraceStatus: getCurrentTraceStatus(state),
    isConnected: state.network.isConnected,
    selectedFeatures: state.map.selectedFeatures || false,
    mode: state.map.mode,
    edits: state.edit.edits,
    editsGeojson: state.edit.editsGeojson,
    loadingData: isLoadingData(state),
    visibleBounds: getVisibleBounds(state),
    zoom: getZoom(state),
    baseLayer: state.map.baseLayer,
    isAuthorized: state.authorization.isAuthorized,
    userDetails,
    requiresPreauth: Config.PREAUTH_URL && !userDetails,
    tracesGeojson: getTracesGeojson(state),
    overlays: state.map.overlays,
    style: state.map.style,
    photosGeojson: getPhotosGeojson(state),
    selectedPhotos: state.map.selectedPhotos,
    nodesGeojson: nodes,
    visibleTiles: getVisibleTiles(state),
    currentWayEdit,
    selectedNode: state.wayEditing.selectedNode
  }
}

const mapDispatchToProps = {
  fetchData,
  setSelectedFeatures,
  startAddPoint,
  mapBackPress,
  setMapMode,
  setAddPointGeometry,
  addFeature,
  updateVisibleBounds,
  uploadEdits,
  setBasemap,
  setNotification,
  startTrace,
  endTrace,
  pauseTrace,
  unpauseTrace,
  loadUserDetails,
  setSelectedPhotos,
  setSelectedNode
}

export default connect(mapStateToProps, mapDispatchToProps)(Explore)
