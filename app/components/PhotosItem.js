import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import Icon from './Collecticons'
import { colors } from '../style/variables'
import formatDate from '../utils/format-date'

const ItemContainer = styled.TouchableOpacity`
  border-bottom-width: 0.2;
  border-bottom-color: ${colors.baseMuted};
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

const Image = styled.Image`
  width: 80;
  height: 80;
  margin-right: 10;
  resize-mode: contain;
`

class PhotosItem extends React.PureComponent {
  constructor (props) {
    super(props)

    // unknown height
    this.height = 100
  }

  getStatusIcon () {
    const { item } = this.props
    let iconName
    let color = colors.primary
    if (item.status === 'pending') {
      iconName = 'clock'
    } else {
      iconName = 'circle-tick'
    }
    return <Icon name={iconName} size={16} color={color} />
  }

  getStatusText () {
    const { item } = this.props
    switch (item.status) {
      case 'uploading':
        return 'Uploading'
      case 'uploaded':
        return `Uploaded at ${formatDate(item.uploadedAt)}`
      case 'pending':
        if (item.errors.length === 0 && item.featureId && item.featureId.search('observe') > -1) {
          return 'Waiting to upload associated feature...'
        }

        if (item.errors.length === 0) {
          return 'Waiting for network...'
        }

        if (item.errors.length > 0) {
          const error = item.errors[item.errors.length - 1]
          return error.message
        }
    }
  }

  _onPress = () => this.props.onPress && this.props.onPress(this.props.item)

  render () {
    const { item } = this.props
    let statusIcon = this.getStatusIcon()
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
            <Image source={{ uri: `file://${item.path}` }} />
            <TextContainer>
              <TitleText>{formatDate(item.location.timestamp)}</TitleText>
              <SubtitleText>{this.getStatusText()}</SubtitleText>
            </TextContainer>
          </Container>
        </ItemContainer>
      </View>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhotosItem)
