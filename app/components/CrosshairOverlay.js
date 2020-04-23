import React, { Component } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'
import Icon from './Collecticons'
import { colors } from '../style/variables'

const Container = styled.View`
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: ${Platform.OS === 'ios' ? 49 : 17};
  margin-left: -15;
`

const Crosshair = styled.Text``

export default class CrosshairOverlay extends Component {
  render () {
    return (
      <Container>
        <Crosshair>
          <Icon name='crosshair-2' size={30} color={colors.primary} />
        </Crosshair>
      </Container>
    )
  }
}
