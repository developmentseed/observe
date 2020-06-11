import React from 'react'
import styled from 'styled-components/native'

const Warning = styled.View`
  position: absolute;
  top: 16;
  margin-left: 5%;
  width: 90%;
  padding-top: 16;
  padding-right: 16;
  padding-bottom: 16;
  padding-left: 16;
  elevation: 1;
  background-color: #ffffff;
`

const Header = styled.Text`
  font-weight: 700;
  margin-bottom: 8;
`

const Text = styled.Text``

export default class LoadingOverlay extends React.Component {
  render () {
    const { id } = this.props
    return (
      <Warning>
        <Header>{id} is in a relation.</Header>
        <Text>Nodes in a relation cannot be deleted or merged with other nodes.</Text>
      </Warning>
    )
  }
}
