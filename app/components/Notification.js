import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'

import Icon from './Collecticons'
import {
  setNotification,
  unsetNotification
} from '../actions/notification'
import { notificationColors } from '../style/variables'

const Container = styled.View`
  flex: 1;
  position: absolute;
  left: 24;
  right: 24
  top: 80;
  border-radius: 4;
  elevation: 4;
`

const DismissNotification = styled.TouchableHighlight`
  flex: 1;
  padding-top: 12;
  padding-right: 12;
  padding-bottom: 12;
  padding-left: 12;
`

const TextWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`

const Text = styled.Text`
  font-size: 16;
  padding-top: 0;
  line-height: 18;
  flex: 0.8;
`

const CloseIcon = styled(Icon)`
  flex: 0.2;
  text-align: right;
`

class Notification extends React.Component {
  render () {
    const { notification, unsetNotification } = this.props

    if (notification == null) {
      return null
    }

    const { level, message } = notification

    const { backgroundColor, color } = notificationColors[level]

    return (
      <Container style={{ backgroundColor }}>
        <DismissNotification onPress={unsetNotification}>
          <TextWrapper>
            <Text style={{ color }}>{message}</Text>
            <CloseIcon name='xmark' size={16} color={color} />
          </TextWrapper>
        </DismissNotification>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  notification: state.notification.notification
})

const mapDispatchToProps = {
  setNotification,
  unsetNotification
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notification)
