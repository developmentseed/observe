import { ActivityIndicator, Dimensions, Platform } from 'react-native'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'

import Icon from './Collecticons'

import { unsetNotification } from '../actions/notification'

import { colors } from '../style/variables'

const win = Dimensions.get('window')

const TitleText = styled.Text`
  font-size: 16;
  color: white;
  font-weight: 700;
  margin-left: 16;
  margin-top: 4;
`

const HeaderWrapper = styled.View`
  height: ${Platform.OS === 'ios' ? 80 : 64};
  background-color: ${colors.primary};
  width: ${win.width};
  border-top-color: #e66533;
`

const HeaderRow = styled.View`
  flex: 1;
  flex-direction: row;
  align-self: stretch;
  align-items: stretch;
  margin-top: ${Platform.OS === 'ios' ? 48 : 16}
  padding-left: 16;
`

const HeaderIcon = styled.TouchableOpacity`
  padding-left: 8;
  padding-right: 8;
  padding-top: 8;
  padding-bottom: 8;
`

const HeaderActions = styled.View`
  flex-direction: row;
  flex: 1;
  position: absolute;
  right: 16;
`

class Header extends React.Component {
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

  renderMenu () {
    return (
      <HeaderIcon onPress={() => this.onMenuPress()}>
        <Icon name='hamburguer-menu' size={16} color='white' />
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
    const { actions, isConnected } = this.props

    let style = {}

    if (!isConnected) {
      style.borderTopWidth = 2
    }

    return (
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
      </HeaderWrapper>
    )
  }
}

const mapStateToProps = state => ({
  isConnected: state.network.isConnected
})

const mapDispatchToProps = {
  unsetNotification
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
