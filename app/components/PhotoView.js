import React from 'react'
import styled from 'styled-components/native'
import { Dimensions } from 'react-native'
import { colors } from '../style/variables'
import formatDate from '../utils/format-date'
import Icon from '../components/Collecticons'

const win = Dimensions.get('window')

const ImageContainer = styled.View`
  align-items: center;
`

const Image = styled.Image`
  width: ${win.width - 20}
  height: 400
  resize-mode: cover;
`

const View = styled.View`
  flex-direction: row;
  align-items: center;
  border-bottom-width: 0.2
  border-bottom-color: ${colors.muted}
  `

const ImageDetailsView = styled.View`
  padding-top: 10;
  padding-left: 15;
  padding-bottom: 10;
  text-align: left;
`

const TimeText = styled.Text`
  font-size: 20;
  letter-spacing: 1;
`
const LocationText = styled.Text`
  color: ${colors.muted};
  padding-bottom: 5;
`

export class PhotoView extends React.Component {
  render () {
    return (
      <ImageContainer>
        <Image source={{ uri: `file://${this.props.path}` }} />
      </ImageContainer>
    )
  }
}
export class ImageDetails extends React.Component {
  render () {
    return (
      <View>
        <Icon name='camera' size={24} color='black' />
        <ImageDetailsView>
          <TimeText>{formatDate(this.props.timestamp)}</TimeText>
          <LocationText>{`${this.props.location.coords.latitude.toFixed(2)}, ${this.props.location.coords.longitude.toFixed(2)}`}</LocationText>
        </ImageDetailsView>
      </View>
    )
  }
}
