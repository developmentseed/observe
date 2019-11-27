import React from 'react'
import styled from 'styled-components/native'
import { Dimensions } from 'react-native'
import Icon from './Collecticons'
import getPlatformStyles from '../utils/get-platform-styles'

const win = Dimensions.get('window')
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

const Button = styled.TouchableHighlight`
  position: absolute;
  border-radius: ${Math.round(win.width + win.height) / 2};
  width: 40;
  height: 40;
  background-color: #fff;
  right: 20;
  top: ${headerHeight.height};
  justify-content: center;
  align-items: center;
  shadow-color: grey;
  shadow-opacity: 0.7;
  shadow-offset: 0px 0px;
  elevation: 1;
`
export default class LocateUserButton extends React.Component {
  render () {
    return (
      <Button underlayColor='#333' onPress={this.props.onPress}>
        <Icon name='crosshair' size={16} color='#0B3954' />
      </Button>
    )
  }
}
