import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import Header from '../components/Header'
import Container from '../components/Container'
import Icon from '../components/Collecticons'
import { loadUserDetails, initiateAuthorization, reset } from '../actions/account'
import { View } from 'react-native'
import PageWrapper from '../components/PageWrapper'
import LoadingOverlay from '../components/LoadingOverlay'
import { colors } from '../style/variables'

const Text = styled.Text``
const ImageView = styled.View`
  justify-content: center;
  align-items: center;
`
const Image = styled.Image`
  border-radius: 50;
  overflow: hidden;
`

const OfflineView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
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

const LoginButton = styled.Button``

const DetailsList = styled.FlatList`
  padding-top: 10;
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
    return (
      <DetailsList
        data={detailsList}
        renderItem={({ item }) => this.renderDetail(item)}
        keyExtractor={(item) => item.value}
      />
    )
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
    if (userDetails) {
      return (
        <Container>
          <Header navigation={navigation} actions={headerActions} />
          <PageWrapper>
            {
              userDetails.image && (
                <ImageView>
                  <Image
                    style={{ width: 100, height: 100 }}
                    source={{ uri: userDetails.image }}
                  />
                </ImageView>
              )
            }
            {this.renderDetails(userDetails)}
          </PageWrapper>
        </Container>
      )
      // render userDetails
    } else {
      return (
        <Container>
          <Header navigation={navigation} />
          <OfflineView>
            <AccountIcon>
              <Icon name='user' size={30} color='grey' />
            </AccountIcon>
            <Text>It seems that you're not logged in.</Text>
            <Text style={{ marginBottom: 8 }}>Do you have an account?</Text>
            <LoginButton
              title='Login'
              onPress={this.props.initiateAuthorization}
              color={colors.primary}
            />
            {showLoadingIndicator}
          </OfflineView>
        </Container>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    userDetails: state.account.userDetails,
    loadingDetails: state.account.loadingDetails
  }
}

const mapDispatchToProps = {
  loadUserDetails,
  initiateAuthorization,
  reset
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)
