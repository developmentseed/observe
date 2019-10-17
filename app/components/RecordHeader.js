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
    height: 64,
    paddingTop: 0
  }
})

const Text = styled.Text`
  color: red;
  font-size: 12;
  margin-right: 20;
  letter-spacing: 1;
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
  padding-left: 20;
`

export default class RecordHeader extends React.Component {
  render () {
    const icon = this.props.paused ? 'circle-play' : 'circle-pause'
    return (
      <HeaderWrapper>
        <RecordingStatus>
          <Icon name='brand-flickr'>
            <Text> RECORDING TRACK</Text>
          </Icon>
        </RecordingStatus>
        <RecordingActions>
          <RecordingDistance>
            <DistanceText>12</DistanceText>
            <DistanceUnitText>DISTANCE (km)</DistanceUnitText>
          </RecordingDistance>
          <RecordingButtons>
            <PauseResumeButton onPress={this.props.pause}>
              <Icon name={icon} color={colors.primary} size={30} />
            </PauseResumeButton>
            <StopButton onPress={this.props.stop}>
              <Icon name='circle-stop' color={colors.primary} size={30} />
            </StopButton>
          </RecordingButtons>
        </RecordingActions>
      </HeaderWrapper>
    )
  }
}
