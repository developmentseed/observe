import React from 'react'
import styled from 'styled-components/native'
import { Dimensions } from 'react-native'
import Icon from './Collecticons'
import { colors } from '../style/variables'

const win = Dimensions.get('window')

const Button = styled.TouchableHighlight`
  position: absolute;
  border-radius: ${Math.round(win.width + win.height) / 2};
  width: 48;
  height: 48;
  background-color: ${colors.primary};
  right: 16;
  bottom: 248;
  justify-content: center;
  align-items: center;
  shadow-color: ${colors.baseAlpha};
  shadow-opacity: 0.7;
  shadow-offset: 0px 0px;
  elevation: 1;
`

export class RecordButton extends React.Component {
  // FIXME: The button is being passed a `status` prop
  // which will be either 'recording', 'paused', or 'none'.
  // The icon will need to change based on this status.
  render () {
    return (
      <Button underlayColor='#333' onPress={this.props.onPress}>
        <Icon name='circle-play' size={20} color='#FFFFFF' />
      </Button>
    )
  }
}
