import React, { Component } from 'react'
import Dialog from 'react-native-dialog'

const inputStyle = {
  borderColor: 'gray',
  borderBottomWidth: 0.5
}

export default class EditMapModal extends Component {
  constructor (props) {
    super(props)

    this.state = {
      name: props.name
    }
  }

  setName = name =>
    this.setState({
      name
    })

  onSave = () => this.props.onSave(this.state.name)

  render () {
    const { onCancel } = this.props
    const { name } = this.state

    return (
      <Dialog.Container visible>
        <Dialog.Title>Rename map</Dialog.Title>
        <Dialog.Input
          wrapperStyle={inputStyle}
          value={name}
          onChangeText={this.setName}
        />
        <Dialog.Button label='Cancel' onPress={onCancel} />
        <Dialog.Button label='Save' onPress={this.onSave} />
      </Dialog.Container>
    )
  }
}
