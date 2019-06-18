import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'

import Header from '../../components/Header'
import Container from '../../components/Container'
import { colors } from '../../style/variables'

const Text = styled.Text`
  font-size: 16;
  letter-spacing: 0.5;
  color: ${colors.base}
`

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
