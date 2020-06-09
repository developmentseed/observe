import React from 'react'
import styled from 'styled-components/native'

import Icon from './Collecticons'

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: absolute;
  top: 100;
  right: 0;
  left: 0;
  bottom: 0;
`

const TextWrapper = styled.TouchableOpacity`
  background-color: rgba(255,255,255,0.8);
  padding-top: 16;
  padding-right: 16;
  padding-bottom: 16;
  padding-left: 16;
  border-radius: 4;
  width: 180;
  flex-direction: row;
`

const Text = styled.Text`
  text-align: center;
`

const PlusIcon = styled(Icon)`
  margin-right: 12;
  margin-top: 3;
`

export default class ZoomToEdit extends React.Component {
  render () {
    const { onPress } = this.props

    return (
      <Container pointerEvents={'box-none'}>
        <TextWrapper onPress={onPress}>
          <PlusIcon name='plus' size={16} color='black' />
          <Text>Zoom in to edit</Text>
        </TextWrapper>
      </Container>
    )
  }
}
