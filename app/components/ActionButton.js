import React from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'

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
  bottom: 16;
  justify-content: center;
  align-items: center;
  shadow-color: grey;
  shadow-opacity: 0.7;
  shadow-offset: 0px 0px;
`

export default class AddButton extends React.Component {
  render () {
    return (
      <Button underlayColor='#333' onPress={this.props.onPress}>
        <Icon name={this.props.icon} size={16} color='white' />
      </Button>
    )
  }
}
