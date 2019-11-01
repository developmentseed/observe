import React from 'react'
import styled from 'styled-components/native'
import { Dimensions } from 'react-native'
import { colors } from '../style/variables'
import formatDate from '../utils/format-date'

const win = Dimensions.get('window')

const ImageContainer = styled.View`
  align-items: center;
`

const Image = styled.Image`
  width: ${win.width - 20}
  height: 400
  resize-mode: cover;
`

const ImageDetailsView = styled.View`
  border-bottom-width: 0.2
  border-bottom-color: ${colors.muted}
  padding-top: 10;
  text-align: left;
`

const TimeText = styled.Text`
  font-size: 24;
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
      <ImageDetailsView>
        <TimeText>{formatDate(this.props.timestamp)}</TimeText>
        <LocationText>{`${this.props.location.coords.latitude.toFixed(2)}, ${this.props.location.coords.longitude.toFixed(2)}`}</LocationText>
      </ImageDetailsView>
    )
  }
}
