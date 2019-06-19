import area from '@turf/area'
import bboxPolygon from '@turf/bbox-polygon'
import React from 'react'
import { NavigationEvents } from 'react-navigation'
import { connect } from 'react-redux'

import Container from '../../components/Container'
import Header from '../../components/Header'
import List from '../../components/OfflineAreaList'
import { deleteOfflineResource, fetchOfflineResources } from '../../actions/map'
import { setNotification } from '../../actions/notification'
import { getOfflineResourceStatus, getVisibleBounds } from '../../selectors'
import { getPlaceName } from '../../utils/get-place-name'

class OfflineAreaList extends React.Component {
  createOfflineResource = async () => {
    const { navigation, visibleBounds } = this.props

    if (visibleBounds == null) {
      // no bounds were selected
      return
    }

    const aoi = [
      visibleBounds[1][0],
      visibleBounds[1][1],
      visibleBounds[0][0],
      visibleBounds[0][1]
    ]

    const areaSqKm = area(bboxPolygon(aoi)) / (1000 ** 2)

    if (areaSqKm > 400) {
      this.props.setNotification({
        level: 'error',
        message: `${areaSqKm.toLocaleString()} km² is too large to download.`
      })

      return
    }

    navigation.navigate('OfflineAreaList')

    const name = (await getPlaceName(aoi)) || 'Unnamed Area'
    this.props.fetchOfflineResources(name, aoi)
  }

  defineOfflineResource = () => {
    const { navigation } = this.props

    // this is weird: we're controlling the Explore screen to get a bbox from it

    navigation.navigate('Explore', {
      // navigation is a DrawerNavigator, so navigation.push doesn't work
      // specify the screen to go back to when the back button is tapped
      back: 'OfflineAreaList',
      // tell the Explore screen what mode we're in
      mode: 'bbox',
      // provide a custom title for the Explore screen
      title: 'Download area',
      // provide some header actions for our use
      actions: [
        {
          name: 'tick',
          onPress: this.createOfflineResource
        }
      ]
    })
  }

  deleteOfflineResource = key => {
    // delete the specified offline resource
    this.props.deleteOfflineResource(key)
  }

  select = key => {
    const { navigation } = this.props

    navigation.navigate('ViewOfflineAreaDetail', {
      key
    })
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.navigation.isFocused()
  }

  onDidFocus = () => {
    this.forceUpdate()
  }

  render () {
    const { navigation, offlineResourceStatus } = this.props

    const headerActions = [
      {
        name: 'download-2',
        onPress: this.defineOfflineResource
      }
    ]

    const offlineData = Object.values(offlineResourceStatus).map(
      ({ name: title, id: key, size, percentage, dataPercentage, tilePercentage, deleting }) => ({
        deleting,
        key,
        percentage,
        dataPercentage,
        tilePercentage,
        size,
        title
      })
    )

    return (
      <Container>
        <NavigationEvents onDidFocus={this.onDidFocus} />
        <Header
          title='Offline Maps'
          navigation={navigation}
          actions={headerActions}
        />
        <List
          data={offlineData}
          onCancelItem={this.deleteOfflineResource}
          onSelectItem={this.select}
        />
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  offlineResourceStatus: getOfflineResourceStatus(state),
  visibleBounds: getVisibleBounds(state)
})

const mapDispatchToProps = {
  deleteOfflineResource,
  fetchOfflineResources,
  setNotification
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OfflineAreaList)
