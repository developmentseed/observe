import React from 'react'
import styled from 'styled-components/native'

import OfflineItem from './OfflineItem'

const StyledFlatList = styled.FlatList``

export default class OfflineAreaList extends React.Component {
  render () {
    const { data, onCancelItem, onSelectItem } = this.props

    return (
      <StyledFlatList
        data={data}
        renderItem={({ item }) => (
          <OfflineItem
            onCancel={onCancelItem}
            onPress={onSelectItem}
            item={item}
          />
        )}
      />
    )
  }
}
