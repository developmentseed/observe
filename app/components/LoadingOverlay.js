import React from 'react'
import styled from 'styled-components/native'
import { colors } from '../style/variables'
import getPlatformStyles from '../utils/get-platform-styles'

const headerHeight = getPlatformStyles({
  ios: {
    height: 80
  },
  iphoneX: {
    height: 100
  },
  android: {
    height: 64
  }
})

const Container = styled.View`
  flex: 1;
  justify-content: center;
  position: absolute;
  left: 16;
  top: ${headerHeight.height - 48};
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
