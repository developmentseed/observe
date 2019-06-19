import Config from 'react-native-config'
import MapboxGL from '@mapbox/react-native-mapbox-gl'
import prettyBytes from 'pretty-bytes'
import React from 'react'
import { Dimensions, Platform, Image, View } from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components/native'

import Header from '../../components/Header'
import Container from '../../components/Container'
import DeleteMapModal from '../../components/DeleteMapModal'
import EditMapModal from '../../components/EditMapModal'
import PageWrapper from '../../components/PageWrapper'
import {
  deleteOfflineResource,
  refreshOfflineResource,
  renameOfflineResource
} from '../../actions/map'
import { getOfflineResourceStatus } from '../../selectors'

const Text = styled.Text`
`
const Bold = styled.Text`
  font-weight: bold;
`

let osmStyleURL = Config.MAPBOX_STYLE_URL || MapboxGL.StyleURL.Street

// fix asset URLs for Android
if (!osmStyleURL.includes(':/') && Platform.OS === 'android') {
  osmStyleURL = `asset://${osmStyleURL}`
}

class ViewOfflineAreaDetail extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Area'
    }
  }

  state = {
    deleteModalVisible: false,
    editModalVisible: false,
    // see Header.HeaderWrapper.height
    imageHeight:
      Dimensions.get('window').height - (Platform.OS === 'ios' ? 80 : 64),
    width: Dimensions.get('window').width
  }

  componentDidMount () {
    const { navigation, offlineResourceStatus } = this.props
    const key = navigation.getParam('key')
    const { aoi } = offlineResourceStatus[key]

    this.takeSnapshot(aoi)
  }

  componentDidUpdate (prevProps) {
    const { navigation } = this.props
    const key = navigation.getParam('key')

    if (prevProps.navigation.getParam('key') !== key) {
      const { aoi } = this.props.offlineResourceStatus[key]

      this.takeSnapshot(aoi)
    }
  }

  async takeSnapshot (aoi) {
    const { imageHeight: height, width } = this.state

    // MapboxGL expects these as [[maxX, maxY], [minX, minY]]
    const bounds = [[aoi[2], aoi[3]], [aoi[0], aoi[1]]]

    try {
      const uri = await MapboxGL.snapshotManager.takeSnap({
        bounds,
        width,
        height,
        styleURL: osmStyleURL
      })

      this.setState({
        preview: uri
      })
    } catch (err) {
      console.log('failed to take snapshot:', err)
    }
  }

  deleteOfflineResource = () => {
    const { deleteOfflineResource, navigation } = this.props

    // dismiss the modal
    this.hideDeleteModal()

    // go back to the previous screen
    navigation.goBack()

    // delete the specified offline resource
    deleteOfflineResource(navigation.getParam('key'))
  }

  hideDeleteModal = () =>
    this.setState({
      deleteModalVisible: false
    })

  hideEditModal = () =>
    this.setState({
      editModalVisible: false
    })

  refreshOfflineResource = () => {
    const {
      navigation,
      offlineResourceStatus,
      refreshOfflineResource
    } = this.props
    const key = navigation.getParam('key')
    const offlineResource = offlineResourceStatus[key]

    if (offlineResource.percentage < 100) {
      return
    }

    refreshOfflineResource(key)
  }

  setName = newName => {
    const { navigation, renameOfflineResource } = this.props
    const id = navigation.getParam('key')

    this.hideEditModal()

    renameOfflineResource(id, newName)
  }

  showDeleteModal = () =>
    this.setState({
      deleteModalVisible: true
    })

  showEditModal = () =>
    this.setState({
      editModalVisible: true
    })

  render () {
    const { navigation, offlineResourceStatus } = this.props
    const {
      deleteModalVisible,
      editModalVisible,
      imageHeight,
      preview,
      width
    } = this.state
    const key = navigation.getParam('key')

    const offlineResource = offlineResourceStatus[key]

    if (offlineResource == null) {
      return null
    }

    let refreshName = 'arrow-loop'

    if (offlineResource.percentage < 100) {
      refreshName = 'activity-indicator'
    }

    const headerActions = [
      {
        name: refreshName,
        onPress: this.refreshOfflineResource
      },
      {
        name: 'trash-bin',
        onPress: this.showDeleteModal
      },
      {
        name: 'pencil',
        onPress: this.showEditModal
      }
    ]

    return (
      <Container>
        {deleteModalVisible && (
          <DeleteMapModal
            name={offlineResource.name}
            onConfirm={this.deleteOfflineResource}
            onCancel={this.hideDeleteModal}
          />
        )}
        {editModalVisible && (
          <EditMapModal
            name={offlineResource.name}
            onSave={this.setName}
            onCancel={this.hideEditModal}
          />
        )}
        <Header
          back
          actions={headerActions}
          navigation={navigation}
          title={offlineResource.name}
        />
        <View>
          {preview && (
            <Image
              style={{ width, height: imageHeight }}
              source={{ uri: preview }}
            />
          )}
        </View>
        <PageWrapper style={{ position: 'absolute', bottom: 0, width }}>
          {offlineResource.percentage < 100 && (
            <Text>
              Data: {offlineResource.dataPercentage.toFixed(2)}% Tiles:{' '}
              {offlineResource.tilePercentage.toFixed(2)}%
            </Text>
          )}
          <Text>
            <Bold>{prettyBytes(offlineResource.size)}</Bold> used (
            <Bold>{prettyBytes(offlineResource.data.size)}</Bold> for data).
          </Text>
          <Text>
            <Bold>
              {offlineResource.completed.toLocaleString()} /{' '}
              {offlineResource.total ? offlineResource.total.toLocaleString() : '???'}
            </Bold>{' '}
            tiles loaded.
          </Text>
        </PageWrapper>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    offlineResourceStatus: getOfflineResourceStatus(state)
  }
}

const mapDispatchToProps = {
  deleteOfflineResource,
  refreshOfflineResource,
  renameOfflineResource
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewOfflineAreaDetail)
