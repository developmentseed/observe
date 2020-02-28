import React from 'react'
import styled from 'styled-components/native'
import { TouchableHighlight, Animated } from 'react-native'

import { colors } from '../style/variables'
import Icon from './Collecticons'

const MenuWrapper = styled.View`
  flex: 1;
  position: absolute;
  justify-content: center;
  align-items: center;
  bottom: 16;
  right: 16;
`

const MenuButton = styled.TouchableHighlight`
  border-radius: 100;
  width: 56;
  height: 56;
  background-color: ${colors.primary};
  justify-content: center;
  align-items: center;
  elevation: 2;
  shadow-color: ${colors.base};
  shadow-opacity: 0.7;
  shadow-offset: 0px 0px;
`
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableHighlight)

const ModeButton = styled(AnimatedTouchable)`
  position: absolute;
  border-radius: 100;
  width: 48;
  height: 48;
  margin-bottom: 8;
  background-color: ${colors.primary};
  justify-content: center;
  align-items: center;
  shadow-color: ${colors.baseAlpha};
  shadow-opacity: 0.7;
  shadow-offset: 0px 0px;
  elevation: 2;
`

const Label = styled(Animated.Text)`
  color: white;
  position: absolute;
  right: 0;
  text-align: right;
  font-size: 14;
  width: 100;
  padding: 2px 4px;
  border-radius: 6;
  background-color: ${colors.baseMed};
`

class MegaMenu extends React.Component {
  animation = new Animated.Value(0)

  toggleMenuOpen = () => {
    const toValue = this.open ? 0 : 1

    Animated.spring(this.animation, {
      toValue,
      friction: 7
    }).start()

    this.open = !this.open
  }

  render () {
    const rotation = {
      transform: [
        {
          rotate: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '45deg']
          })
        }
      ]
    }

    const opacityInterpolation = this.animation.interpolate({
      inputRange: [0, 0.75, 1],
      outputRange: [0, 0, 1]
    })

    const PointButtonPosition = {
      opacity: opacityInterpolation,
      transform: [
        { scale: this.animation },
        {
          translateY: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -60]
          })
        }
      ]
    }

    const WayButtonPosition = {
      opacity: opacityInterpolation,
      transform: [
        { scale: this.animation },
        {
          translateY: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -116]
          })
        }
      ]
    }

    const RecordButtonPosition = {
      opacity: opacityInterpolation,
      transform: [
        { scale: this.animation },
        {
          translateY: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -172]
          })
        }
      ]
    }

    const CameraButtonPosition = {
      opacity: opacityInterpolation,
      transform: [
        { scale: this.animation },
        {
          translateY: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -228]
          })
        }
      ]
    }

    const LabelPosition = {
      opacity: opacityInterpolation,
      transform: [
        {
          translateX: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -52]
          })
        }
      ]
    }
    return (
      <MenuWrapper>
        <ModeButton style={[CameraButtonPosition]} underlayColor={colors.base} onPress={this.props.onCameraPress}>
            <>
              <Label style={[LabelPosition]}>Take Photo</Label>
              <Icon name='camera' size={20} color='#FFFFFF' />
            </>
        </ModeButton>
        <ModeButton style={[RecordButtonPosition]} underlayColor={colors.base} status={this.props.recordStatus} onPress={this.props.onRecordPress}>
            <>
              <Label style={[LabelPosition]}>Record Track</Label>
              <Icon name='circle-play' size={20} color='#FFFFFF' />
            </>
        </ModeButton>
        <ModeButton style={[WayButtonPosition]} underlayColor={colors.base} onPress={this.props.onWayPress}>
            <>
              <Label style={[LabelPosition]}>Add Way</Label>
              <Icon name='share-2' size={20} color='#FFFFFF' />
            </>
        </ModeButton>
        <ModeButton style={[PointButtonPosition]} underlayColor={colors.base} onPress={this.props.onPointPress}>
            <>
              <Label style={[LabelPosition]}>Add Point</Label>
              <Icon name='marker' size={20} color='#FFFFFF' />
            </>
        </ModeButton>
        <MenuButton underlayColor={colors.base} onPress={this.toggleMenuOpen}>
          <Animated.View style={[rotation]}>
            <Icon name='plus' size={20} color='#FFFFFF' />
          </Animated.View>
        </MenuButton>
      </MenuWrapper>
    )
  }
}

export default MegaMenu
