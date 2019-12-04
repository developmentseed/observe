import { ActivityIndicator, Dimensions } from 'react-native'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import getPlatformStyles from '../utils/get-platform-styles'
import Icon from './Collecticons'
import { unsetNotification } from '../actions/notification'
import ConfirmDialog from './ConfirmDialog'

import {
  pauseTrace,
  unpauseTrace,
  discardTrace
} from '../actions/traces'

import { colors } from '../style/variables'
import RecordHeader from '../components/RecordHeader'
import {
  getCurrentTraceLength,
  getCurrentTraceStatus,
  showRecordingHeader
} from '../selectors'
import { isValidTrace } from '../utils/traces'

const win = Dimensions.get('window')
const Container = styled.View``

const headerStyles = getPlatformStyles({
  ios: {
    height: 80,
    paddingTop: 10
  },
  iphoneX: {
    height: 100,
    paddingTop: 30
  },
  android: {
    height: 64,
    paddingTop: 0
  }
})

const TitleText = styled.Text`
  font-size: 20;
  color: white;
  font-weight: 500;
  letter-spacing: 0.15;
  margin-left: 16;
`

const HeaderWrapper = styled.View`
  min-height: ${headerStyles.height};
  background-color: ${colors.primary};
  width: ${win.width};
  border-top-color: #e66533;
  padding-top: ${headerStyles.paddingTop};
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
`

const HeaderRow = styled.View`
  min-height: ${headerStyles.height};
  flex-direction: row;
  align-items: center;
  padding-left: 16;
  flex-shrink: 0;
`

const HeaderIcon = styled.TouchableOpacity`
  padding-left: 8;
  padding-right: 8;
`

const HeaderActions = styled.View`
  flex-direction: row;
  flex: 1;
  position: absolute;
  right: 16;
`

class Header extends React.Component {
  state = {
    dialogVisible: false,
    discardDialogVisible: false
  }

  renderTitle () {
    if (this.props.title) {
      return (
        <TitleText>{this.props.title}</TitleText>
      )
    }
  }

  onBackPress = () => {
    const { back, navigation } = this.props

    if (typeof back === 'string') {
      // back was provided as the name of a screen to treat as "back"
      return navigation.navigate(back)
    } else if (typeof back === 'function') {
      // if back was a function, call it
      return back()
    }

    navigation.goBack()
  }

  renderBack () {
    return (
      <HeaderIcon onPress={this.onBackPress}>
        <Icon name='arrow-left' size={16} color='white' />
      </HeaderIcon>
    )
  }

  onMenuPress () {
    this.props.unsetNotification()
    this.props.navigation.openDrawer()
  }

  onPauseBtnPress = () => {
    const {
      currentTraceStatus,
      pauseTrace,
      unpauseTrace
    } = this.props
    if (currentTraceStatus === 'paused') {
      unpauseTrace()
    } else {
      pauseTrace()
    }
  }

  onStopBtnPress = () => {
    const { currentTrace } = this.props
    if (!isValidTrace(currentTrace)) {
      this.setState({ discardDialogVisible: true })
    } else {
      this.setState({ dialogVisible: true })
    }
  }

  cancelDialog = () => {
    this.setState({ dialogVisible: false })
  }

  cancelDiscardDialog = () => {
    this.setState({ discardDialogVisible: false })
  }

  continueDiscardTrace = () => {
    const { discardTrace } = this.props
    this.setState({ discardDialogVisible: false })
    discardTrace()
  }

  saveTrace = () => {
    this.cancelDialog()
    this.props.navigation.navigate('SaveTrace')
  }

  renderMenu () {
    return (
      <HeaderIcon onPress={() => this.onMenuPress()}>
        <Icon name='hamburguer-menu' size={18} color='white' />
      </HeaderIcon>
    )
  }

  renderActions () {
    const { actions } = this.props

    return (
      <HeaderActions>
        {
          actions.map((action) => {
            let icon

            switch (action.name) {
              case 'activity-indicator':
                icon = <ActivityIndicator color='white' />
                break

              default:
                icon = <Icon name={action.name} size={16} color='white' />
            }

            return (
              <HeaderIcon key={`action-${action.name}`} onPress={() => action.onPress()}>
                {icon}
              </HeaderIcon>
            )
          })
        }
      </HeaderActions>
    )
  }

  render () {
    const {
      actions,
      isConnected,
      isRecording,
      currentTraceLength,
      currentTraceStatus
    } = this.props

    let style = {}

    if (!isConnected) {
      style.borderTopWidth = 2
    }
    let showRecordingHeader = null
    if (isRecording) {
      showRecordingHeader = (
        <RecordHeader
          paused={currentTraceStatus === 'paused'}
          distance={currentTraceLength.toFixed(2)}
          onStopBtnPress={this.onStopBtnPress}
          onPauseBtnPress={this.onPauseBtnPress}
        />
      )
    }
    return (
      <Container>
        <HeaderWrapper style={style}>
          <HeaderRow>
            {
              this.props.back
                ? this.renderBack()
                : this.renderMenu()
            }
            { this.renderTitle() }
            { actions && this.renderActions() }
          </HeaderRow>
          { showRecordingHeader }
        </HeaderWrapper>
        <ConfirmDialog title='Stop recording and save?' description='Stop GPS logging and save the current track' visible={this.state.dialogVisible} cancel={this.cancelDialog} continue={this.saveTrace} />
        <ConfirmDialog title='Invalid trace' description='The current trace cannot be saved. Do you want to discard it?' visible={this.state.discardDialogVisible} continueLabel='Discard' cancel={this.cancelDiscardDialog} continue={this.continueDiscardTrace} />

      </Container>
    )
  }
}

const mapStateToProps = state => ({
  isConnected: state.network.isConnected,
  isRecording: showRecordingHeader(state),
  currentTraceStatus: getCurrentTraceStatus(state),
  currentTraceLength: getCurrentTraceLength(state),
  currentTrace: state.traces.currentTrace
})

const mapDispatchToProps = {
  unsetNotification,
  pauseTrace,
  unpauseTrace,
  discardTrace
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
