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
  color: ${colors.muted}
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
  background-color: white;
  align-items: center;
  justify-content: center;
  border-bottom-width: 0.2;
  border-bottom-color: ${colors.muted};
`

const RecordingActions = styled.View`
  flex: 1;
  flex-direction: row;
  align-content: center;
  justify-content: center;
`
const RecordingDistance = styled.View`
  align-items: flex-start;
  justify-content: center;
  padding-left: 20;
`

const PauseButton = styled.TouchableOpacity`
  justify-content: center;
  padding-left: 20;
`

const StopButton = styled.TouchableOpacity`
  justify-content: center;
  padding-left: 20;
`

export default class RecordHeader extends React.Component {
  render () {
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
          <PauseButton>
            <Icon name='circle-pause' color={colors.primary} size={30} />
          </PauseButton>
          <StopButton>
            <Icon name='circle-stop' color={colors.primary} size={30} />
          </StopButton>
        </RecordingActions>
      </HeaderWrapper>
    )
  }
}
