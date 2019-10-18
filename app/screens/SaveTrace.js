import React from 'react'
import { connect } from 'react-redux'
import Header from '../components/Header'
import styled from 'styled-components/native'
import {
  endTrace
} from '../actions/traces'
import Container from '../components/Container'
import PageWrapper from '../components/PageWrapper'
import { DescriptionInputField } from '../components/Input'

const View = styled.View`
  height: 100;
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
        <PageWrapper>
          <View>
            <DescriptionInputField value={this.state.description} onValueChange={(value) => this.setState({
              description: value
            })} />
          </View>
        </PageWrapper>
      </Container>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {
  endTrace
}

export default connect(mapStateToProps, mapDispatchToProps)(SaveTrace)
