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
  padding-left: 16;
  padding-right: 16;
  padding-bottom: 16;
  padding-top: 8;
  elevation: 1;
  shadowOffset: { width: 5, height: -5 };
  shadowColor: ${colors.baseMuted};
  shadowOpacity: 0.5;
  shadowRadius: 10;
`

const AddNodeButton = styled.TouchableHighlight`
  border-radius: 100;
  width: 56;
  height: 56;
  background-color: white;
  justify-content: center;
  align-items: center;
  elevation: 3;
  shadow-color: ${colors.primary};
  shadow-opacity: 0.4;
  shadow-offset: 0px 0px;
  shadowRadius: 3;
  margin-top: -16;
`

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableHighlight)

const ActionButton = styled(AnimatedTouchable)`
  width: 48;
  height: 48;
  justify-content: center;
  align-items: center;
  border-radius: 100;
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
        <CompleteWayButton onPress={onCompleteWayPress} underlayColor={colors.base}>
          <Icon name='tick' size={20} color='#FFFFFF' />
        </CompleteWayButton>
        <MenuWrapper>
          <ActionButton onPress={onDeleteNodePress} underlayColor='#E4E6F2'>
            <Icon name='trash-bin' size={24} color={colors.primary} />
          </ActionButton>
          <ActionButton onPress={onUndoPress} underlayColor='#E4E6F2'>
            <Icon name='arrow-semi-spin-ccw' size={24} color={colors.primary} />
          </ActionButton>
          <AddNodeButton onPress={onAddNodePress} underlayColor='#E4E6F2'>
            <Icon name='plus' size={24} color={colors.primary} />
          </AddNodeButton>
          <ActionButton onPress={onRedoPress} underlayColor='#E4E6F2'>
            <Icon name='arrow-semi-spin-cw' size={24} color={colors.primary} />
          </ActionButton>
          <ActionButton onPress={onMoveNodePress} underlayColor='#E4E6F2'>
            <Icon name='arrow-move' size={24} color={colors.primary} />
          </ActionButton>
        </MenuWrapper>
      </>
    )
  }
}

export default WayEditingOverlay