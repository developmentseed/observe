import React from 'react'
import { connect } from 'react-redux'
import Header from '../components/Header'
import getPlatformStyles from '../utils/get-platform-styles'
import Icon from '../components/Collecticons'
import { colors } from '../style/variables'
import {
  endTrace
} from '../actions/traces'
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
          const { endTrace } = this.props
          const description = '' // FIXME: get description
          endTrace(description)
          // FIXME: navigate away
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

    return (
      <Container>
        <Header back title={title} navigation={navigation} actions={headerActions} />
        <PageWrapper />
      </Container>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {
  endTrace
}

export default connect(mapStateToProps, mapDispatchToProps)(SaveTrace)
