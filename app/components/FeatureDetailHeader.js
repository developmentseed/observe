import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import ConfirmDialog from './ConfirmDialog'
import FeatureRelationErrorDialog from './FeatureRelationErrorDialog'
import ObserveIcon from './ObserveIcon'
import { colors } from '../style/variables'
import getDefaultPreset from '../utils/get-default-preset'
import getPresetByTags from '../utils/get-preset-by-tags'
import { modes } from '../utils/map-modes'

const Header = styled.View`
  padding-top: 16;
  padding-right: 16;
  padding-bottom: 16;
  padding-left: 16;
  flex-direction: row;
  background-color: white;
`

const PresetName = styled.Text`
  font-weight: 500;
  margin-top: 4;
`

const IconWrapper = styled.TouchableOpacity`
  width: 48;
  height: 48;
  margin-right: 8;
  justify-content: center;
  align-items: center;
`

const Button = styled.TouchableHighlight``

const Coordinates = styled.Text`
  color: ${colors.baseMuted};
  font-size: 14;
  padding-right: 4;
`

const Edit = styled.Text`
  color: ${colors.primary};
  font-size: 14;
`

const geometryTypeToEditMode = {
  'Point': modes.EDIT_POINT,
  'LineString': modes.EDIT_WAY,
  'Polygon': modes.EDIT_WAY
}

export default class FeatureDetailHeader extends React.Component {
  state = {
    dialogVisible: false,
    featureInRelationDialogVisible: false
  }

  onEditPress () {
    const { feature, navigation } = this.props
    const geometryType = feature.geometry.type
    const mode = geometryTypeToEditMode[geometryType]
    navigation.navigate('Explore', { feature, mode })
  }

  renderEditGeometryButton () {
    const { feature, navigation } = this.props
    const { pendingDeleteUpload } = feature.properties

    // Hide edit geometry button on AddFeatureDetail screen
    if (navigation.state.routeName === 'AddFeatureDetail') {
      return
    }

    // If feature was deleted and waiting to be uploaded, block further edits
    // by passing button without associated action.
    if (pendingDeleteUpload) {
      return <Button>
        <Coordinates>
          <Edit>This feature was deleted</Edit>
        </Coordinates>
      </Button>
    }

    // Get feature type to allow/disallow editing
    let featureType
    switch (feature.geometry.type) {
      case 'Point':
        featureType = 'node'
        break
      case 'LineString':
        featureType = 'way'
        break
      case 'Polygon':
        featureType = 'way'
        break
      default:
        featureType = 'unsupported'
        break
    }

    if (featureType === 'unsupported') {
      // If feature is unsupported, block further edits
      return <Button>
        <Coordinates>
          <Edit>Editing this feature is not supported</Edit>
        </Coordinates>
      </Button>
    } else {
      // Toggle button label on feature type
      return (
        <Button onPress={() => this.onEditPress()}>
          <Coordinates>
            {feature === 'node' ? (
              <Edit>Move Geometry</Edit>
            ) : (
              <Edit>Edit Geometry</Edit>
            )}
          </Coordinates>
        </Button>
      )
    }
  }

  render () {
    const { feature, navigation } = this.props
    let { preset } = this.props
    if (!feature) return null

    if (!preset) {
      preset = getPresetByTags(feature.properties) || getDefaultPreset(feature.geometry.type)
    }

    const cancelDialog = () => {
      this.setState({ dialogVisible: false })
    }

    const toggleFeatureRelationDialog = () => {
      const visible = this.state.featureInRelationDialogVisible
      this.setState({
        featureInRelationDialogVisible: !visible
      })
    }

    const changePreset = () => {
      cancelDialog()
      navigation.navigate('SelectFeatureType', { feature })
    }

    const icon = (preset.icon || feature.properties.icon || 'maki_marker').replace(/-/g, '_')

    return (
      <>
        <Header>
          {
            <IconWrapper
              onPress={() => {
                if (preset) {
                  if (this.props.featureInRelation) {
                    toggleFeatureRelationDialog()
                    return
                  }

                  this.setState({ dialogVisible: true })
                }
              }}
            >
              <ObserveIcon name={icon} size={36} color={colors.primary} />
            </IconWrapper>
          }
          <View>
            <PresetName>{preset.name}</PresetName>
            {this.renderEditGeometryButton()}
          </View>
        </Header>
        <ConfirmDialog visible={this.state.dialogVisible} cancel={cancelDialog} continue={changePreset} />
        <FeatureRelationErrorDialog
          visible={this.state.featureInRelationDialogVisible}
          description='Changing the preset of a feature in a relation is not currently supported'
          confirm={() => {
            toggleFeatureRelationDialog()
          }}
        />
      </>
    )
  }
}
