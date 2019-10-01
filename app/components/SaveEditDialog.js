import React from 'react'
import styled from 'styled-components/native'
import Dialog from 'react-native-dialog'

const View = styled.View`
`

const TextInput = {
  borderColor: 'gray',
  borderBottomWidth: 0.5
}

export default class SaveEditDialog extends React.Component {
  state = {
    comment: 'Changeset created from Observe'
  }

  message = () => {
    const action = this.props.action || null
    if (action && action === 'delete') {
      return (
        <Dialog.Description>Do you want to delete this feature? Please enter a changeset comment.</Dialog.Description>
      )
    } else {
      return (
        <Dialog.Description>Do you want to save the changes? Please enter a changeset comment.</Dialog.Description>
      )
    }
  }

  render () {
    return (
      <View>
        <Dialog.Container visible={this.props.visible} {...{ onBackdropPress: this.props.cancel }}>
          <Dialog.Title>Save changes</Dialog.Title>
          {this.message()}
          <Dialog.Input wrapperStyle={TextInput} placeholder='Changeset comment' onChangeText={text => this.setState({ comment: text })}></Dialog.Input>
          <Dialog.Button label='Cancel' onPress={this.props.cancel} />
          <Dialog.Button label='Save' onPress={() => { this.props.save(this.state.comment) }} />
        </Dialog.Container>
      </View>
    )
  }
}
