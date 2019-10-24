import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import { Linking } from 'react-native'
import Config from 'react-native-config'
import { purgeCache, purgeStore } from '../actions/about'
import { purgeAllEdits } from '../actions/edit'
import { startTrace, endTrace } from '../actions/traces'
import Icon from '../components/Collecticons'
import Header from '../components/Header'
import PageWrapper from '../components/PageWrapper'
import { colors } from '../style/variables'
import { version } from '../../package.json'

const Container = styled.View`
  flex: 1;
`

const Button = styled.Button`
  margin-bottom: 8;
`

const ButtonWrapper = styled.View`
  margin-bottom: 8;
`

const SettingsHeader = styled.Text`
  font-weight: bold;
  font-size: 20;
  margin-top: 16;
  margin-bottom: 16;
`
const Text = styled.Text`
`

class Settings extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Settings',
      drawerLabel: 'Settings',
      drawerIcon: () => (
        <Icon
          name='cog'
          style={{ fontSize: 16, color: colors.primary }}
        />
      )
    }
  }

  apiLogin = () => {
    const redirectURL = 'observe://apilogin'
    const loginURL = `${Config.OBSERVE_API_URL}/login?redirect=${redirectURL}`
    Linking.openURL(loginURL).catch(e => console.log('error opening url', e))
  }

  render () {
    const { navigation } = this.props

    return (
      <Container>
        <Header title='Settings' navigation={navigation} />
        <PageWrapper>
          <SettingsHeader>Advanced Settings</SettingsHeader>
          <ButtonWrapper>
            <Button
              onPress={this.props.purgeCache}
              title='Delete tile / data cache'
              color={colors.primary}
            />
          </ButtonWrapper>
          <ButtonWrapper>
            <Button
              onPress={this.props.purgeAllEdits}
              title='Delete all pending edits'
              color={colors.primary}
            />
          </ButtonWrapper>
          <ButtonWrapper>
            <Button
              onPress={this.props.purgeStore}
              title='Delete app state'
              color={colors.primary}
            />
          </ButtonWrapper>
          <ButtonWrapper>
            <Button
              onPress={this.props.startTrace}
              title='Start Trace'
              color={colors.primary}
              disabled={!!this.props.currentTrace}
            />
            <Button
              onPress={this.props.endTrace}
              title='End Trace'
              color={colors.primary}
              disabled={!this.props.currentTrace}
            />
          </ButtonWrapper>
          <ButtonWrapper>
            <Button
              onPress={this.apiLogin}
              title='Login to Observe API'
              color={colors.primary}
            />
          </ButtonWrapper>
          <Text>
            Observe-{version}
          </Text>
        </PageWrapper>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  currentTrace: state.traces.currentTrace
})

const mapDispatchToProps = {
  purgeCache,
  purgeStore,
  purgeAllEdits,
  startTrace,
  endTrace
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)
