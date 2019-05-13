import React from 'react'
import styled from 'styled-components/native'
import Dialog from 'react-native-dialog'

const View = styled.View`
`
export default class ConfirmDialog extends React.Component {
  render () {
    return (
      <View>
        <Dialog.Container visible={this.props.visible} {...{ onBackdropPress: this.props.cancel }}>
          <Dialog.Title>Change feature preset?</Dialog.Title>
          <Dialog.Description>
            This will remove all existing tags from the feature.
          </Dialog.Description>
          <Dialog.Button label='Cancel' onPress={this.props.cancel} />
          <Dialog.Button label='Continue' onPress={() => { this.props.continue() }} />
        </Dialog.Container>
      </View>
    )
  }
}
