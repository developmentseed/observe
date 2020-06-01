import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import ActionButton from '../components/ActionButton'
import CrossHairOverlay from './CrosshairOverlay'

import { showRecordingHeader } from '../selectors'

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
        <CrossHairOverlay isRecording={this.props.isRecording} />
        <ActionButton icon='tick' onPress={() => this.props.onAddConfirmPress()} />
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isRecording: showRecordingHeader(state)
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPointOverlay)
