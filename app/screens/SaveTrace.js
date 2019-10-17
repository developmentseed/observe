import React from 'react'
import { connect } from 'react-redux'
import Header from '../components/Header'
import getPlatformStyles from '../utils/get-platform-styles'
import Icon from '../components/Collecticons'
import { colors } from '../style/variables'
import { Dimensions } from 'react-native'
import Container from '../components/Container'
import PageWrapper from '../components/PageWrapper'

const win = Dimensions.get('window')

class SaveTrace extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Save GPX Track'
    }
  }

  render () {
    const { navigation } = this.props
    const title = 'Save GPX Track'

    const headerActions = [
      {
        name: 'tick',
        onPress: () => {
          console.log('save')
        }
      },
      {
        name: 'trash-bin',
        onPress: () => {
          console.log('remove trace')
        }
      }
    ]

    return (
      <Container>
        <Header back title={title} navigation={navigation} actions={headerActions} />
        <PageWrapper></PageWrapper>
      </Container>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(SaveTrace)
