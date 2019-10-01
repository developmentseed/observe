import React, { PureComponent } from 'react'
import Dialog from 'react-native-dialog'

export default class DeleteMapModal extends PureComponent {
  render () {
    const { name, onConfirm, onCancel } = this.props

    const description = `Your offline map "${name}" will be deleted.`

    return (
      <Dialog.Container visible>
        <Dialog.Title>Delete this map?</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
        <Dialog.Button label='Cancel' onPress={onCancel} />
        <Dialog.Button label='Yes' onPress={onConfirm} />
      </Dialog.Container>
    )
  }
}
