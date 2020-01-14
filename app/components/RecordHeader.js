import { Dimensions } from 'react-native'
import React from 'react'
import styled from 'styled-components/native'
import getPlatformStyles from '../utils/get-platform-styles'
import Icon from './Collecticons'
import { colors } from '../style/variables'

const win = Dimensions.get('window')
const headerStyles = getPlatformStyles({
  ios: {
    height: 80
  },
  iphoneX: {
    height: 100
  },
  android: {
    height: 80,
    paddingTop: 0
  }
})

const Text = styled.Text`
  font-size: 12;
  letter-spacing: 1;
  text-transform: uppercase;
  margin-left: 10px;
`
const DistanceText = styled.Text`
  font-size: 24;
  letter-spacing: 1;
`

const DistanceUnitText = styled.Text`
  font-size: 12;
  color: ${colors.muted};
`

const HeaderWrapper = styled.View`
  height: ${headerStyles.height};
  width: ${win.width};
  background-color: white;
  display: flex;
  border-bottom-width: 0.2;
  border-bottom-color: ${colors.muted};
`

const RecordingStatus = styled.View`
  height: 30;
  width: ${win.width};
  background-color: #fafafa;
  align-items: center;
  justify-content: center;
  border-bottom-width: 0.3;
  border-bottom-color: ${colors.muted};
`

const RecordingActions = styled.View`
  flex: 1;
  flex-direction: row;
  align-content: center;
  justify-content: center;
`
const RecordingDistance = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-left: 20;
  padding-right: 20;
  padding-top: 10;
  padding-bottom: 10;
  border-right-width: 0.2;
  border-right-color: ${colors.muted};
`
const RecordingButtons = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const PauseResumeButton = styled.TouchableOpacity`
  justify-content: center;
`

const StopButton = styled.TouchableOpacity`
  justify-content: center;
  margin-left: 24;
`

export default class RecordHeader extends React.Component {
  render () {
    const icon = this.props.paused ? 'circle-play' : 'circle-pause'
    const iconColor = this.props.paused ? colors.secondary : colors.primary
    const { distance, onPauseBtnPress, onStopBtnPress } = this.props
    return (
      <HeaderWrapper>
        <RecordingStatus>
          <Icon name={this.props.paused ? 'circle-pause' : 'circle-play'} color={this.props.paused ? 'gray' : 'red'}>
            <Text style={{ color: this.props.paused ? 'gray' : 'red' }}>{ this.props.paused ? ' Recording paused' : ' Recording track' }</Text>
          </Icon>
        </RecordingStatus>
        <RecordingActions>
          <RecordingDistance>
            <DistanceText>{ distance }</DistanceText>
            <DistanceUnitText>DISTANCE (m)</DistanceUnitText>
          </RecordingDistance>
          <RecordingButtons>
            <PauseResumeButton onPress={onPauseBtnPress}>
              <Icon name={icon} color={iconColor} size={30} />
            </PauseResumeButton>
            <StopButton onPress={onStopBtnPress}>
              <Icon name='circle-stop' color={colors.baseMed} size={30} />
            </StopButton>
          </RecordingButtons>
        </RecordingActions>
      </HeaderWrapper>
    )
  }
}
