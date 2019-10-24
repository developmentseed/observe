import React, { Component } from 'react'
import Dialog from 'react-native-dialog'
import Config from 'react-native-config'

export default class AuthMessage extends Component {
  onPress = () => this.props.onPress()

  render () {
    return (
      <Dialog.Container visible>
        <Dialog.Title>
          Log in with {Config.PREAUTH_NAME}. You'll then be redirected to log in with {Config.OSM_LAYER_NAME}.
        </Dialog.Title>

        <Dialog.Button label='Log in' onPress={this.onPress} />
      </Dialog.Container>
    )
  }
}
