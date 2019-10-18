import React from 'react'
import { connect } from 'react-redux'
import Header from '../components/Header'
import styled from 'styled-components/native'
import {
  endTrace,
  startSavingTrace,
  stopSavingTrace
} from '../actions/traces'
import Container from '../components/Container'
import PageWrapper from '../components/PageWrapper'
import { DescriptionInputField } from '../components/Input'
import { NavigationEvents } from 'react-navigation'
import { colors } from '../style/variables'
import { getCurrentTraceLength } from '../selectors'
import formatDate from '../utils/format-date'

const View = styled.View`
  height: 100;
  margin-top: 10;
`

const TraceDetails = styled.View`
  border-bottom-width: 0.2;
  border-bottom-color: ${colors.muted};
`
const DistanceText = styled.Text`
  font-size: 24;
  letter-spacing: 1;
`
const TimeText = styled.Text`
  font-size: 18;
  letter-spacing: 1;
  color: ${colors.muted}
  margin-bottom: 5;
`

class SaveTrace extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Save GPX Track'
    }
  }

  state = {
    description: ''
  }

  onDidFocus = () => {
    this.props.startSavingTrace()
    this.setState({
      description: ''
    })
  }

  onDidBlur = () => {
    this.props.stopSavingTrace()
  }

  render () {
    const { navigation } = this.props
    const title = 'Save GPX Track'

    const headerActions = [
      {
        name: 'tick',
        onPress: () => {
          console.log('save')
          const { endTrace } = this.props
          const description = this.state.description
          endTrace(description)
          navigation.navigate('Explore')
        }
      },
      {
        name: 'trash-bin',
        onPress: () => {
          console.log('remove trace')
          // FIXME: we need to add an action to cancel trace
        }
      }
    ]

    console.log(this.props.currentTrace)

    return (
      <>
        <NavigationEvents
          onDidFocus={this.onDidFocus}
          onDidBlur={this.onDidBlur}
        />
        <Container>
          <Header back title={title} navigation={navigation} actions={headerActions} />
          <PageWrapper>
            <TraceDetails>
              <DistanceText>
                {Math.floor(this.props.currentTraceLength)} km
              </DistanceText>
              <TimeText>
                {formatDate(this.props.currentTrace.properties.timestamps[0])}
              </TimeText>
            </TraceDetails>
            <View>
              <DescriptionInputField value={this.state.description} onValueChange={(value) => this.setState({
                description: value
              })} />
            </View>
          </PageWrapper>
        </Container>
      </>
    )
  }
}

const mapStateToProps = state => ({
  currentTrace: state.traces.currentTrace,
  currentTraceLength: getCurrentTraceLength(state)
})

const mapDispatchToProps = {
  endTrace,
  startSavingTrace,
  stopSavingTrace
}

export default connect(mapStateToProps, mapDispatchToProps)(SaveTrace)
