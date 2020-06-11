import React from 'react'
import styled from 'styled-components/native'
import Dialog from 'react-native-dialog'
import { colors } from '../style/variables'

const View = styled.View`
`

export default class FeatureRelationErrorDialog extends React.Component {
  render () {
    const title = this.props.title ? this.props.title : 'Operation not allowed'
    const description = this.props.description ? this.props.description : 'This operation changes a feature in a relation in a way that is not currently supported'
    const confirmLabel = this.props.confirmLabel ? this.props.confirmLabel : 'Ok'

    return (
      <View>
        <Dialog.Container visible={this.props.visible} {...{ onBackdropPress: this.props.cancel }}>
          <Dialog.Title style={{ fontWeight: 'bold' }}>{title}</Dialog.Title>
          <Dialog.Description style={{ color: colors.base }}>
            {description}
          </Dialog.Description>
          <Dialog.Button
            color={colors.primary}
            label={confirmLabel}
            onPress={() => { this.props.confirm && this.props.confirm() }}
          />
        </Dialog.Container>
      </View>
    )
  }
}
