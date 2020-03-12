import React from 'react'
import styled from 'styled-components/native'
import { TouchableHighlight, Animated } from 'react-native'

import { colors } from '../style/variables'
import Icon from './Collecticons'

const MenuWrapper = styled.View`
  flex: 1;
  position: absolute;
  flex-direction: row;
  justify-content: space-between;
  background-color: white;
  bottom: 0;
  width: 100%;
  padding-left: 10;
  padding-right: 10;
  padding-bottom: 15;
`

const AddNodeButton = styled.TouchableHighlight`
  border-radius: 100;
  width: 56;
  height: 56;
  background-color: white;
  justify-content: center;
  align-items: center;
  elevation: 2;
  shadow-color: ${colors.base};
  shadow-opacity: 0.7;
  shadow-offset: 0px 0px;
  margin-top: -10;
`

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableHighlight)

const ActionButton = styled(AnimatedTouchable)`
  width: 48;
  height: 48;
  margin-bottom: 8;
  justify-content: center;
  align-items: center;
`

const CompleteWayButton = styled.TouchableHighlight`
  border-radius: 100;
  width: 56;
  height: 56;
  background-color: ${colors.primary};
  elevation: 2;
  shadow-color: ${colors.base};
  shadow-opacity: 0.7;
  shadow-offset: 0px 0px;
  bottom: 100;
  right: 16;
  position: absolute;
  justify-content: center;
  align-items: center;
`

class WayEditingOverlay extends React.Component {
  render () {
    const {
      onDeleteNodePress,
      onUndoPress,
      onAddNodePress,
      onRedoPress,
      onMoveNodePress,
      onCompleteWayPress
    } = this.props

    return (
      <>
        <CompleteWayButton onPress={onCompleteWayPress}>
          <Icon name='tick' size={20} color='#FFFFFF' />
        </CompleteWayButton>
        <MenuWrapper>
          <ActionButton onPress={onDeleteNodePress}>
            <Icon name='trash-bin' size={20} color='#6579FC' />
          </ActionButton>
          <ActionButton onPress={onUndoPress}>
            <Icon name='arrow-semi-spin-ccw' size={20} color='#6579FC' />
          </ActionButton>
          <AddNodeButton onPress={onAddNodePress}>
            <Icon name='plus' size={20} color='#6579FC' />
          </AddNodeButton>
          <ActionButton onPress={onRedoPress}>
            <Icon name='arrow-semi-spin-cw' size={20} color='#6579FC' />
          </ActionButton>
          <ActionButton onPress={onMoveNodePress}>
            <Icon name='arrow-move' size={20} color='#6579FC' />
          </ActionButton>
        </MenuWrapper>
      </>
    )
  }
}

export default WayEditingOverlay
