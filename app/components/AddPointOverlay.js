import React, { Component } from 'react'
import {
  Platform
} from 'react-native'
import styled from 'styled-components/native'

import ActionButton from '../components/ActionButton'
import CrossHairOverlay from './CrosshairOverlay'

const Container = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
`

class AddPointOverlay extends Component {
  render () {
    return (
      <Container pointerEvents={Platform.OS === 'ios' ? 'box-none' : 'auto'}>
        <CrossHairOverlay />
        <ActionButton icon='tick' onPress={() => this.props.onAddConfirmPress()} />
      </Container>
    )
  }
}

export default AddPointOverlay
