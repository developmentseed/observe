import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import { Platform } from 'react-native'
import MapboxGL from '@mapbox/react-native-mapbox-gl'
import { AndroidBackHandler } from 'react-navigation-backhandler'
import Config from 'react-native-config'
import { NavigationEvents } from 'react-navigation'

import {
  fetchData,
  setSelectedFeatures,
  mapBackPress,
  startAddPoint,
  setMapMode,
  updateVisibleBounds,
  setBasemap
} from '../actions/map'

import {
  setAddPointGeometry,
  addFeature,
  uploadEdits
} from '../actions/edit'

import {
  setNotification
} from '../actions/notification'

import Header from '../components/Header'
import MapOverlay from '../components/MapOverlay'
import AddPointOverlay from '../components/AddPointOverlay'
import LoadingOverlay from '../components/LoadingOverlay'
import ZoomToEdit from '../components/ZoomToEdit'
import getRandomId from '../utils/get-random-id'
import LocateUserButton from '../components/LocateUserButton'
import getUserLocation from '../utils/get-user-location'
import { getVisibleBounds, getVisibleFeatures, getZoom, isLoadingData } from '../selectors'
import BasemapModal from '../components/BasemapModal'
import ActionButton from '../components/ActionButton'
import Icon from '../components/Collecticons'
import { colors } from '../style/variables'

import style from '../style/map'
import icons from '../assets/icons'
import { preAuth } from '../services/auth'

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
`

const StyledMap = styled(MapboxGL.MapView)`
  flex: 1;
  width: 100%;
`

class Explore extends React.Component {
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
      clickableLayers: ['editedPois', 'pois', 'editedPolygons', 'buildings', 'roads', 'roadsLower', 'railwayLine', 'waterLine', 'leisure'],
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
    this.forceUpdate()
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

    // pre-auth if necessary; credentials probably expired
    preAuth()
  }

  onRegionIsChanging = async evt => {
    // update the redux state with the bbox
    this.props.updateVisibleBounds(await this.mapRef.getVisibleBounds(), await this.mapRef.getZoom())
  }

  _fetchData (visibleBounds, zoomLevel) {
    // fetch new data only if zoom is greater than 16
    if (zoomLevel >= 16) {
      const { fetchData } = this.props

      fetchData(visibleBounds)
    }
  }

  onRegionDidChange = evt => {
    const { properties: { visibleBounds, zoomLevel } } = evt
    this.props.updateVisibleBounds(visibleBounds, zoomLevel)
  }

  onPress = e => {
    const screenBbox = this.getBoundingBox([e.properties.screenPointX, e.properties.screenPointY])
    this.loadFeaturesAtPoint(screenBbox)
  }

  onUserLocationUpdate = location => {
    // console.log('user location updated', location)
  }

  async locateUser () {
    try {
      const userLocation = await getUserLocation()
      if (userLocation.hasOwnProperty('coords')) {
        this.mapRef.setCamera({
          centerCoordinate: [userLocation.coords.longitude, userLocation.coords.latitude],
          zoom: 18
        })
      }
    } catch (error) {
      console.log('error fetching user location', error)
    }
  }

  async loadFeaturesAtPoint (rect) {
    try {
      const { features } = await this.mapRef.queryRenderedFeaturesInRect(rect, null, this.state.clickableLayers)
      this.props.setSelectedFeatures(features)
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
    const { mode, mapBackPress } = this.props
    if (mode === 'explore') { // let default back handling happen when in Explore mode
      return false
    }
    mapBackPress()
    return true
  }

  renderZoomToEdit () {
    const { zoom } = this.props

    if (!zoom || zoom >= 16) return null

    return (
      <ZoomToEdit onPress={() => {
        this.mapRef.zoomTo(16.5)
      }} />
    )
  }

  getBackButton = () => {
    const { navigation, mode } = this.props
    switch (true) {
      case navigation.getParam('back'):
        return navigation.getParam('back')
      case mode === 'add' || mode === 'edit':
        return this.onBackButtonPress
      case mode === 'bbox':
        return 'OfflineMaps'
      default:
        return false
    }
  }

  getTitle = () => {
    const { navigation, mode } = this.props
    switch (true) {
      case navigation.getParam('title'):
        return navigation.getParam('title')
      case mode === 'add':
        return 'Add Point'
      case mode === 'edit':
        return 'Edit Point'
      case mode === 'bbox':
        return 'Select Bounds'
      default:
        return 'Observe'
    }
  }

  render () {
    const { userTrackingMode } = this.state
    const { navigation, geojson, selectedFeatures, editsGeojson, setMapMode, mode } = this.props
    let selectedFeatureIds = null

    if (selectedFeatures) {
      selectedFeatureIds = {
        'nodes': ['in', 'id'],
        'ways': ['in', 'id']
      }
      selectedFeatures.reduce((selectedFeatureIds, currentFeature) => {
        this.getFeatureType(currentFeature) === 'node' ? selectedFeatureIds.nodes.push(currentFeature.id) : selectedFeatureIds.ways.push(currentFeature.id)
        return selectedFeatureIds
      }, selectedFeatureIds)
    }

    let filteredFeatureIds = null
    if (editsGeojson.features.length) {
      filteredFeatureIds = {
        'nodes': ['!in', 'id'],
        'ways': ['!in', 'id']
      }

      editsGeojson.features.reduce((filteredFeatureIds, feature) => {
        this.getFeatureType(feature) === 'node' ? filteredFeatureIds.nodes.push(feature.id) : filteredFeatureIds.ways.push(feature.id)
        return filteredFeatureIds
      }, filteredFeatureIds)
    }

    let overlay
    switch (mode) {
      case 'add':
        overlay = (<AddPointOverlay
          onAddConfirmPress={this.onAddConfirmPress}
        />)
        break

      case 'edit':
        overlay = (<AddPointOverlay
          onAddConfirmPress={this.onEditConfirmPress}
        />)
        break

      case 'bbox':
        break

      default:
        overlay = (
          <>
            <MapOverlay
              features={geojson.features}
              onAddButtonPress={this.onAddButtonPress}
              navigation={navigation}
            />
            <ActionButton icon='plus' onPress={() => this.onAddButtonPress()} />
          </>
        )
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

    return (
      <AndroidBackHandler onBackPress={() => this.onBackButtonPress()}>
        <NavigationEvents
          onWillFocus={this.onWillFocus}
          onDidFocus={this.onDidFocus}
          onWillBlur={payload => {
            if (payload.state.params && payload.state.params.mode === 'bbox') {
              // reset params once this screen has been used in bbox mode
              navigation.setParams({
                back: null,
                mode: 'explore',
                title: null,
                actions: null
              })

              // reset map mode
              setMapMode('explore')
            }
          }}
        />
        <Container>
          <Header
            actions={navigation.getParam('actions', [])}
            back={this.getBackButton()}
            navigation={navigation}
            title={this.getTitle()}
          />
          <StyledMap
            // centerCoordinate={[77.5946, 12.9716]} remove this because it was causing a crash on iPhone physical device
            onDidFinishRenderingMapFully={this.onDidFinishRenderingMapFully}
            onWillStartLoadingMap={this.onWillStartLoadingMap}
            onDidFailLoadingMap={this.onDidFailLoadingMap}
            onRegionIsChanging={this.onRegionIsChanging}
            onRegionDidChange={this.onRegionDidChange}
            regionDidChangeDebounceTime={10}
            onPress={this.onPress}
            minZoomLevel={2}
            maxZoomLevel={19}
            ref={(ref) => { this.mapRef = ref }}
            zoomLevel={18}
            showUserLocation
            onUserLocationUpdate={this.onUserLocationUpdate}
            userTrackingMode={userTrackingMode}
            styleURL={styleURL}
          >
            <MapboxGL.ShapeSource id='geojsonSource' shape={geojson} images={icons}>
              <MapboxGL.LineLayer id='roadsHighlight' filter={['==', '$type', 'LineString']} style={style.lineHighlight} minZoomLevel={16} />
              <MapboxGL.LineLayer id='roads' filter={['==', '$type', 'LineString']} style={style.highways} minZoomLevel={16} />
              <MapboxGL.LineLayer id='roadsLower' filter={['all', ['in', 'highway', 'foot', 'footway', 'hiking', 'living_street', 'cycleway', 'steps'], ['==', '$type', 'LineString']]} style={style.highwaysLower} minZoomLevel={16} />
              <MapboxGL.LineLayer id='railwayLine' filter={['all', ['has', 'railway'], ['==', '$type', 'LineString']]} style={style.railwayLine} minZoomLevel={16} />
              <MapboxGL.LineLayer id='waterLine' filter={['all', ['has', 'waterway'], ['==', '$type', 'LineString']]} style={style.waterLine} minZoomLevel={16} />
              <MapboxGL.FillLayer id='buildings' filter={['all', ['has', 'building'], filteredFeatureIds ? filteredFeatureIds.ways : ['!in', 'id', '']]} style={style.buildings} minZoomLevel={16} />
              <MapboxGL.FillLayer id='leisure' filter={['any', ['in', 'leisure', 'pitch', 'track', 'garden'], ['in', 'natural', 'wood'], ['in', 'landuse', 'grass', 'forest']]} style={style.leisure} minZoomLevel={16} />
              <MapboxGL.LineLayer id='featureSelect' filter={selectedFeatureIds ? selectedFeatureIds.ways : ['==', 'id', '']} style={style.lineSelect} minZoomLevel={16} />
              <MapboxGL.CircleLayer id='iconHalo' style={style.iconHalo} minZoomLevel={16} filter={['all', ['has', 'icon'], ['==', '$type', 'Point'], filteredFeatureIds ? filteredFeatureIds.nodes : ['!in', 'id', '']]} />
              <MapboxGL.CircleLayer id='iconHaloSelected' style={style.iconHaloSelected} minZoomLevel={16} filter={['all', ['has', 'icon'], ['==', '$type', 'Point'], selectedFeatureIds ? selectedFeatureIds.nodes : ['==', 'id', ''], filteredFeatureIds ? filteredFeatureIds.nodes : ['!in', 'id', '']]} />
              <MapboxGL.SymbolLayer id='pois' style={style.icons} filter={['all', ['has', 'icon'], ['==', '$type', 'Point'], filteredFeatureIds ? filteredFeatureIds.nodes : ['!in', 'id', '']]} />
            </MapboxGL.ShapeSource>
            <MapboxGL.ShapeSource id='editGeojsonSource' shape={editsGeojson}>
              <MapboxGL.FillLayer id='editedPolygons' filter={['==', '$type', 'Polygon']} style={style.editedPolygons} minZoomLevel={16} />
              <MapboxGL.CircleLayer id='editedIconHalo' style={style.iconEditedHalo} minZoomLevel={16} filter={['all', ['has', 'icon'], ['==', '$type', 'Point']]} />
              <MapboxGL.CircleLayer id='editedIconHaloSelected' style={style.iconHaloSelected} minZoomLevel={16} filter={['all', ['has', 'icon'], ['==', '$type', 'Point'], selectedFeatureIds ? selectedFeatureIds.nodes : ['==', 'id', '']]} />
              <MapboxGL.SymbolLayer id='editedPois' style={style.icons} filter={['all', ['has', 'icon'], ['==', '$type', 'Point']]} />
            </MapboxGL.ShapeSource>
          </StyledMap>
          { overlay }
          {/* should hide this entire element when not in loading state */}
          { showLoadingIndicator }
          <LocateUserButton onPress={() => this.locateUser()} />
          <BasemapModal onChange={this.props.setBasemap} />
          {mode !== 'bbox' && this.renderZoomToEdit()}
        </Container>
      </AndroidBackHandler>
    )
  }
}

const mapStateToProps = state => ({
  geojson: getVisibleFeatures(state),
  isConnected: state.network.isConnected,
  selectedFeatures: state.map.selectedFeatures || false,
  mode: state.map.mode,
  edits: state.edit.edits,
  editsGeojson: state.edit.editsGeojson,
  loadingData: isLoadingData(state),
  visibleBounds: getVisibleBounds(state),
  zoom: getZoom(state),
  baseLayer: state.map.baseLayer
})

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
  setNotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Explore)
