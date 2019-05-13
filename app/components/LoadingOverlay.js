import React from 'react'
import styled from 'styled-components/native'
import { colors } from '../style/variables'

const Container = styled.View`
  flex: 1;
  justify-content: center;
  position: absolute;
  left: 16;
  top: 80;
`

const ActivityIndicator = styled.ActivityIndicator``

export default class LoadingOverlay extends React.Component {
  render () {
    const color = this.props.color || colors.primary
    const size = this.props.size || 'large'

    return (
      <Container>
        <ActivityIndicator animating={this.props.animating} size={size} color={color} />
      </Container>
    )
  }
}
