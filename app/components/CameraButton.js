import React from 'react'
import styled from 'styled-components/native'
import { Dimensions } from 'react-native'
import Icon from './Collecticons'

const win = Dimensions.get('window')

const Button = styled.TouchableHighlight`
  position: absolute;
  border-radius: ${Math.round(win.width + win.height) / 2};
  width: 48;
  height: 48;
  background-color: #fff;
  right: 16;
  bottom: 185;
  justify-content: center;
  align-items: center;
  shadow-color: grey;
  shadow-opacity: 0.7;
  shadow-offset: 0px 0px;
  elevation: 1;
`
export class CameraButton extends React.Component {
  render () {
    return (
      <Button underlayColor='#333' onPress={this.props.onPress}>
        <Icon name='camera' size={20} color='#0B3954' />
      </Button>
    )
  }
}
