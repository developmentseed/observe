import React from 'react'
import styled from 'styled-components/native'
import Dialog from 'react-native-dialog'
import { colors } from '../style/variables'

const View = styled.View`
`
export default class ConfirmDialog extends React.Component {
  render () {
    const title = this.props.title ? this.props.title : 'Change feature preset?'
    const description = this.props.description ? this.props.description : 'This will remove all existing tags from the feature.'
    const cancelLabel = this.props.cancelLabel ? this.props.cancelLabel : 'Cancel'
    const continueLabel = this.props.continueLabel ? this.props.continueLabel : 'Continue'
    return (
      <View>
        <Dialog.Container visible={this.props.visible} {...{ onBackdropPress: this.props.cancel }}>
          <Dialog.Title style={{ fontWeight: 'bold' }}>{title}</Dialog.Title>
          <Dialog.Description style={{ color: colors.base }}>
            {description}
          </Dialog.Description>
          <Dialog.Button color={colors.secondary} label={cancelLabel} onPress={this.props.cancel} />
          <Dialog.Button color={colors.primary} label={continueLabel} onPress={() => { this.props.continue() }} />
        </Dialog.Container>
      </View>
    )
  }
}
