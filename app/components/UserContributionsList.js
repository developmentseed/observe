import React from 'react'
import styled from 'styled-components/native'

import UserContributionsItem from './UserContributionsItem'
import { colors } from '../style/variables'

const StyledFlatList = styled.FlatList`
  font-size: 16;
  letter-spacing: 0.5;
  color: ${colors.base}
`

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
