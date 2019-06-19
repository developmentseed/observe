import prettyBytes from 'pretty-bytes'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import styled from 'styled-components/native'

import Icon from './Collecticons'
import { colors } from '../style/variables'

const ItemContainer = styled.TouchableOpacity`
  border-bottom-width: 1;
  border-bottom-color: #ccc;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 5px 0px;
`

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: stretch;
`

const TextContainer = styled.View`
  flex: 1;
  margin-right: 44px;
`

const TitleText = styled.Text`
`

const SubtitleText = styled.Text`
  font-size: 12;
  color: ${colors.baseMuted};
`

const StatusContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 44;
`

const CloseContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  height: 44;
  width: 44;
`

export default class OfflineItem extends React.PureComponent {
  constructor (props) {
    super(props)

    // unknown height
    this.height = null
  }

  _onCancel = () =>
    this.props.onCancel && this.props.onCancel(this.props.item.key)

  _onPress = () => this.props.onPress && this.props.onPress(this.props.item.key)

  render () {
    const {
      item: { title, size, percentage, deleting }
    } = this.props

    let subtitle = prettyBytes(size || 0)
    let statusIcon = <Icon name='circle-tick' size={16} color={colors.primary} />
    let cancelable = false

    if (percentage < 100) {
      subtitle = `Downloading: ${percentage.toFixed(2)}% (${prettyBytes(
        size || 0
      )})`
      statusIcon = <ActivityIndicator color={colors.primary} />
      cancelable = true
    }

    if (deleting) {
      subtitle = `Deleting...`
      statusIcon = <ActivityIndicator color={colors.primary} />
    }

    return (
      <View
        style={{ height: this.height }}
        onLayout={({
          nativeEvent: {
            layout: { height }
          }
        }) => (this.height = height)}
      >
        <ItemContainer onPress={this._onPress}>
          <Container>
            <StatusContainer>{statusIcon}</StatusContainer>
            <TextContainer>
              <TitleText>{title}</TitleText>
              <SubtitleText>{subtitle}</SubtitleText>
            </TextContainer>
          </Container>
          {cancelable && (
            <CloseContainer onPress={this._onCancel}>
              <Icon name='xmark' />
            </CloseContainer>
          )}
        </ItemContainer>
      </View>
    )
  }
}
