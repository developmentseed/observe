import React from 'react'
import styled from 'styled-components/native'
import Dialog from 'react-native-dialog'

const View = styled.View`
`
export default class ConfirmDialog extends React.Component {
  render () {
    const title = this.props.title ? this.props.title : 'Change feature preset?'
    const description = this.props.description ? this.props.description : 'This will remove all existing tags from the feature.'
    return (
      <View>
        <Dialog.Container visible={this.props.visible} {...{ onBackdropPress: this.props.cancel }}>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>
            {description}
          </Dialog.Description>
          <Dialog.Button label='Cancel' onPress={this.props.cancel} />
          <Dialog.Button label='Continue' onPress={() => { this.props.continue() }} />
        </Dialog.Container>
      </View>
    )
  }
}
