import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'

import Header from '../../components/Header'
import Container from '../../components/Container'

const Text = styled.Text``

class ChangeCoordinates extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Set Feature Coordinates'
    }
  }

  render () {
    const { navigation } = this.props

    return (
      <Container>
        <Header navigation={navigation} />
        <Text>Set Feature Coordinates</Text>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeCoordinates)
