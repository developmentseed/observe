import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import Container from '../../components/Container'
import Header from '../../components/Header'
import PageWrapper from '../../components/PageWrapper'
import { DescriptionInputField } from '../../components/Input'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import _find from 'lodash.find'
import ConfirmDialog from '../../components/ConfirmDialog'
import { NavigationEvents } from 'react-navigation'
import { getTraceLength } from '../../utils/traces'
import formatDate from '../../utils/format-date'
import { colors } from '../../style/variables'
import { editTrace } from '../../actions/traces'

const DescriptionView = styled.View`
  padding-top: 10;
`

const DescriptionTitle = styled.Text`
  font-weight: bold;
`
const Text = styled.Text`
  padding-top: 5
`
const View = styled.View`
  height: 100;
  padding-left: 5;
  padding-right: 5;
  padding-top: 5;
  padding-bottom: 5;
`
const TitleView = styled.View`
  padding-top: 10;
  padding-bottom: 10;
  border-bottom-width: 0.2
  border-bottom-color: ${colors.muted}
`

const LengthText = styled.Text`
  font-size: 20;
  letter-spacing: 1;
`

const TimeText = styled.Text`
  padding-top: 5;
  padding-bottom: 5;
  letter-spacing: 1;
`

const MapContainer = styled.View`
  height: 400;
  background-color: gray;
`
class TraceDetailScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Trace Details'
    }
  }

  state = {
    editing: false,
    description: null
  }

  getTrace = (id) => {
    const { traces } = this.props
    const trace = _find(traces, (t) => { return t.id === id })
    return trace
  }

  onWillFocus = () => {
    const { navigation } = this.props
    const traceId = navigation.getParam('trace')
    const trace = this.getTrace(traceId)
    this.setState({
      description: trace.geojson.properties.description
    })
  }

  onWillBlur = () => {
    this.setState({
      editing: false,
      description: null
    })
  }

  cancelDialog = () => {
    this.setState({
      dialogVisible: false
    })
  }

  confirmDelete = async () => {
    const { navigation } = this.props
    this.cancelDialog()
    // FIXME: wire up trace delete actions
    navigation.navigate('TracesListScreen')
  }

  render () {
    const { navigation, editTrace } = this.props
    const previousScreen = navigation.getParam('previousScreen') || 'TracesListScreen'
    const traceId = navigation.getParam('trace')
    const trace = this.getTrace(traceId)
    const length = getTraceLength(trace.geojson).toFixed(2)
    const timestamp = trace.geojson.properties.timestamps[0]
    const headerActions = [
      {
        name: this.state.editing ? 'tick' : 'pencil',
        onPress: () => {
          const editing = !this.state.editing
          if (trace.description !== this.state.description) {
            editTrace(trace, this.state.description)
          }
          this.setState({
            editing: editing
          })
        }
      },
      {
        name: 'trash-bin',
        onPress: () => {
          this.setState({
            dialogVisible: true
          })
        }
      }
    ]

    let showDescription
    if (this.state.editing) {
      showDescription = (
        <DescriptionView>
          <View>
            <DescriptionInputField focus={this.state.editing} value={this.state.description} onValueChange={(value) => this.setState({ description: value })} />
          </View>
        </DescriptionView>
      )
    } else {
      showDescription = (
        <DescriptionView>
          <DescriptionTitle>Description</DescriptionTitle>
          <Text>{this.state.description}</Text>
        </DescriptionView>
      )
    }

    if (trace) {
      return (
        <>
          <NavigationEvents
            onWillFocus={this.onWillFocus}
            onWillBlur={this.onWillBlur}
          />
          <Container>
            <Header back={previousScreen} title='Trace Details' navigation={navigation} actions={headerActions} />
            <KeyboardAwareScrollView
              style={{ backgroundColor: '#fff' }}
              resetScrollToCoords={{ x: 0, y: 0 }}
              scrollEnabled={false}
              extraScrollHeight={100}
              enableOnAndroid
            >
              <PageWrapper>
                <MapContainer />
                <TitleView>
                  <LengthText>{length} m Trace</LengthText>
                  <TimeText>{formatDate(timestamp)}</TimeText>
                </TitleView>
                {showDescription}
              </PageWrapper>
            </KeyboardAwareScrollView>
            <ConfirmDialog visible={this.state.dialogVisible} title='Delete this trace?' description='This cannot be undone' cancel={this.cancelDialog} continue={this.confirmDelete} />
          </Container>
        </>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => {
  return {
    traces: state.traces.traces
  }
}

const mapDispatchToProps = {
  editTrace
}

export default connect(mapStateToProps, mapDispatchToProps)(TraceDetailScreen)
