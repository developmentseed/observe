import React from 'react'
import styled from 'styled-components/native'

import UserContributionsItem from './UserContributionsItem'

const StyledFlatList = styled.FlatList``

export default class UserContributionsList extends React.Component {
  render () {
    const { data, onSelectItem } = this.props
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
