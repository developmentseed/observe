import React, { Component } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'
import Icon from './Collecticons'
import { colors } from '../style/variables'

const marginTop = Platform.OS === 'ios' ? 49 : 17

const Container = styled.View`
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: ${marginTop};
  margin-left: -15;
`

const Crosshair = styled.Text``

export default class CrosshairOverlay extends Component {
  render () {
    const style = {
      marginTop: this.props.isRecording ? marginTop + 50 : marginTop
    }

    return (
      <Container style={style}>
        <Crosshair>
          <Icon name='crosshair-2' size={30} color={colors.primary} />
        </Crosshair>
      </Container>
    )
  }
}
