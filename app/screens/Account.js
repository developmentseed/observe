import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import Header from '../components/Header'
import Container from '../components/Container'
import Icon from '../components/Collecticons'
import { loadUserDetails, initiateAuthorization, reset } from '../actions/account'
import { View, Linking } from 'react-native'
import PageWrapper from '../components/PageWrapper'
import LoadingOverlay from '../components/LoadingOverlay'
import { colors } from '../style/variables'
import Config from 'react-native-config'

const Text = styled.Text`
`

const ImageView = styled.View`
  justify-content: center;
  align-items: center;
`
const Image = styled.Image`
  border-radius: 50;
  overflow: hidden;
`

const AccountView = styled.View`
  flex: 1;
  margin-top: 30px;
  align-items: center;
  justify-content: center;
  height: 200;
`

const AccountIcon = styled.Text`
  padding-bottom: 10;
`

const Field = styled.View`
  border-bottom-width: 1;
  border-bottom-color: #efefef;
  padding-bottom: 8;
  margin-bottom: 8;
`

const FieldKey = styled.Text`
  font-weight: 500;
  font-size: 16;
`

const FieldValue = styled.Text`
  font-weight: 300;
  font-size: 14;
  padding-top: 2;
`

const LoginButton = styled.Button`
  padding-left: 2;
  padding-right: 2;
  letter-spacing: 1;
`

const DetailsList = styled.FlatList`
  padding-top: 10;
`

const ObserveDetailsView = styled.View`
  flex-direction: row;
  align-content: center;
  align-items: center;
`

class Account extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Account',
      drawerIcon: () => (
        <Icon
          name='user'
          style={{ fontSize: 16, color: colors.primary }}
        />
      )
    }
  }

  async componentDidMount () {
    this.props.loadUserDetails()
  }

  apiLogin = () => {
    const redirectURL = 'observe://apilogin'
    const loginURL = `${Config.OBSERVE_API_URL}/login?redirect=${redirectURL}`
    Linking.openURL(loginURL).catch(e => console.log('error opening url', e))
  }

  renderDetail (detail) {
    return (
      <Field>
        <View>
          <FieldKey>{detail.key}</FieldKey>
        </View>
        <View>
          <FieldValue>{detail.value}</FieldValue>
        </View>
      </Field>
    )
  }
  renderDetails (details) {
    const detailsList = []
    const keyLabelMap = {
      'username': 'Name',
      'uid': 'User ID',
      'account_created': 'Mapper since',
      'changesets_count': 'Number of changesets',
      'description': 'Bio'
    }
    Object.keys(details).forEach(k => {
      if (k !== 'image' && details[k]) {
        detailsList.push({ 'key': keyLabelMap[k], 'value': details[k] })
      }
    })

    let showImage = null
    if (details.image) {
      showImage = (
        <ImageView>
          <Image
            style={{ width: 100, height: 100 }}
            source={{ uri: details.image }}
          />
        </ImageView>
      )
    }
    return (
      <>
        {showImage}
        <DetailsList
          data={detailsList}
          renderItem={({ item }) => this.renderDetail(item)}
          keyExtractor={(item) => item.value}
        />
      </>
    )
  }

  renderOSMDetails (userDetails) {
    if (userDetails) {
      return this.renderDetails(userDetails)
    } else {
      return (
        <AccountView>
          <AccountIcon>
            <Icon name='user' size={30} color='grey' />
          </AccountIcon>
          <Text>It seems that you're not logged in.</Text>
          <Text style={{ marginBottom: 8 }}>Do you have an account?</Text>
          <LoginButton
            title='Log in'
            onPress={this.props.initiateAuthorization}
            color={colors.primary}
          />
        </AccountView>
      )
    }
  }

  renderObserveApiDetails () {
    const { observeApi } = this.props
    console.log('observeApi', observeApi)
    if (!observeApi) {
      return (
        <AccountView>
          <Text>Observe API is not connected.</Text>
          <Text style={{ marginBottom: 8 }}>Authorize to upload photos and traces.</Text>
          <LoginButton
            title='Authorize'
            onPress={this.apiLogin}
            color={colors.primary}
          />
        </AccountView>
      )
    } else {
      return (
        <ObserveDetailsView>
          <Icon name='circle-tick' size={30} color='blue' />
          <Text style={{ marginLeft: 10 }}>Observe API authorized.
          </Text>
        </ObserveDetailsView>
      )
    }
  }

  render () {
    const { navigation } = this.props
    const { userDetails } = this.props
    let showLoadingIndicator = null
    if (this.props.loadingDetails) {
      showLoadingIndicator = (
        <LoadingOverlay />
      )
    }

    const headerActions = [
      {
        name: 'logout',
        onPress: () => {
          this.props.reset()
        }
      }
    ]

    return (
      <Container>
        <Header title='Account' navigation={navigation} actions={headerActions} />
        <PageWrapper>
          {this.renderOSMDetails(userDetails)}
          {this.renderObserveApiDetails()}
          {showLoadingIndicator}
        </PageWrapper>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    userDetails: state.account.userDetails,
    loadingDetails: state.account.loadingDetails,
    observeApi: state.observeApi.token || false
  }
}

const mapDispatchToProps = {
  loadUserDetails,
  initiateAuthorization,
  reset
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)
