import { Dimensions } from 'react-native'
import React from 'react'
import styled from 'styled-components/native'
import getPlatformStyles from '../utils/get-platform-styles'
import Icon from './Collecticons'
import { colors } from '../style/variables'

const win = Dimensions.get('window')
const headerStyles = getPlatformStyles({
  ios: {
    height: 20
  },
  iphoneX: {
    height: 30
  },
  android: {
    height: 20,
    paddingTop: 0
  }
})

const Text = styled.Text`
  color: red;
  font-size: 12;
  margin-right: 20;
`

const HeaderWrapper = styled.View`
  height: ${headerStyles.height};
  width: ${win.width};
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom-width: 0.2;
  border-bottom-color: ${colors.muted};
`

export default class RecordHeader extends React.Component {
  render () {
    return (
      <HeaderWrapper>
        <Icon name='brand-flickr'>
          <Text> RECORDING TRACK</Text>
        </Icon>
      </HeaderWrapper>
    )
  }
}
