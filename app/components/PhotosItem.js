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
    if (item.pending) {
      iconName = 'clock'
    } else {
      iconName = 'circle-tick'
    }
    return <Icon name={iconName} size={16} color={color} />
  }

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
        <ItemContainer>
          <Container>
            <StatusContainer>{statusIcon}</StatusContainer>
            <Image source={{ uri: `file://${item.path}` }} />
            <TextContainer>
              <TitleText>{formatDate(item.location.timestamp)}</TitleText>
              <SubtitleText>{item.description}</SubtitleText>
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
