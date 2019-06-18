import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import ConfirmDialog from '../components/ConfirmDialog'
import { colors } from '../style/variables'
import getDefaultPreset from '../utils/get-default-preset'

const Header = styled.View`
  padding-top: 16;
  padding-right: 16;
  padding-bottom: 16;
  padding-left: 16;
  flex-direction: row;
  background-color: white;
`

const PresetName = styled.Text`
  font-size: 16;
  font-weight: 500;
  letter-spacing: 0.5;
  color: ${colors.base};
  margin-top: 4;
`

const IconCircle = styled.TouchableOpacity`
  border-radius: ${48 / 2};
  width: 48;
  height: 48;
  background-color: ${colors.primary};
  margin-right: 8;
  justify-content: center;
  align-items: center;
`

const PresetIcon = styled.Image`
  width: 32;
  height: 32;
`

const Button = styled.TouchableHighlight``

const Coordinates = styled.Text`
  color: ${colors.baseMuted};
  padding-right: 4;
`

const Edit = styled.Text`
  color: ${colors.primary};
  text-align: right;
`

export default class FeatureDetailHeader extends React.Component {
  state = {
    dialogVisible: false
  }

  render () {
    const { feature, navigation } = this.props
    let { preset } = this.props
    if (!feature) return null

    if (!preset) {
      preset = getDefaultPreset(feature.geometry.type)
    }

    const geometryType = feature.geometry.type
    const coordinates = feature.geometry.coordinates

    const cancelDialog = () => {
      this.setState({ dialogVisible: false })
    }

    const changePreset = () => {
      cancelDialog()
      navigation.navigate('SelectFeatureType', { feature })
    }
    return (
      <>
        <Header>
          {
            (
              <IconCircle onPress={() => {
                if (preset) {
                  this.setState({ dialogVisible: true })
                }
              }}>
                <PresetIcon source={{ uri: feature.properties.icon }} />
              </IconCircle>
            )
          }
          <View>
            <PresetName>{preset.name}</PresetName>
            {
              geometryType === 'Point' && (
                <Button
                  onPress={() => {
                    navigation.navigate('Explore', { feature, mode: 'edit' })
                  }}
                >
                  <Coordinates>
                    {coordinates[0].toFixed(3)}, {coordinates[1].toFixed(3)}
                    <Edit> Edit coordinates</Edit>
                  </Coordinates>
                </Button>
              )
            }
          </View>
        </Header>
        <ConfirmDialog visible={this.state.dialogVisible} cancel={cancelDialog} continue={changePreset} />
      </>
    )
  }
}
