import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import Icon from './Collecticons'
import { colors } from '../style/variables'
import formatDate from '../utils/format-date'
import { getTraceLength } from '../utils/traces'

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

class TracesItem extends React.PureComponent {
  constructor (props) {
    super(props)

    // unknown height
    this.height = 80
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
      case 'uploaded':
        return 'Uploaded'
      case 'pending':
        if (item.errors.length === 0) {
          return 'Waiting for network...'
        }

        if (item.errors.length > 0) {
          const error = item.errors[item.errors.length - 1]
          return error.message
        }
        break
      default:
        return 'An unknown error has occured'
    }
  }

  _onPress = () => this.props.onPress && this.props.onPress(this.props.item)

  render () {
    const { item } = this.props
    const timestamp = item.geojson.properties.timestamps[0]
    const length = getTraceLength(item.geojson).toFixed(2)
    const statusIcon = this.getStatusIcon()
    const statusText = this.getStatusText()
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
              <TitleText>{formatDate(timestamp)}</TitleText>
              <SubtitleText>{length} m</SubtitleText>
              <SubtitleText>{statusText}</SubtitleText>
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
)(TracesItem)
