import React from 'react'
import styled from 'styled-components/native'
import Container from '../components/Container'

import UserContributionsItem from './UserContributionsItem'

const TextContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const Text = styled.Text``

const StyledFlatList = styled.FlatList``

export default class UserContributionsList extends React.Component {
  render () {
    const { data, onSelectItem } = this.props

    if (data && !data.length) {
      return (
        <Container>
          <TextContainer>
            <Text>No contributions to display.</Text>
            <Text>Make an edit to have it appear here!</Text>
          </TextContainer>
        </Container>
      )
    }

    return (
      <StyledFlatList
        data={data}
        keyExtractor={item => `${item.id}-${item.timestamp}`}
        renderItem={({ item }) => (
          <UserContributionsItem
            onPress={onSelectItem}
            item={item}
          />
        )}
      />
    )
  }
}
