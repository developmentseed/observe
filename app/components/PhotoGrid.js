import React from 'react'
import styled from 'styled-components/native'

const FlatList = styled.FlatList`
  padding-bottom: 30;
`

const View = styled.View`
  border: 0.5px;
  margin-right: 10;
`
const Image = styled.Image`
  width: 60;
  height: 60;
  resize-mode: contain;
`

class GridItem extends React.Component {
  render () {
    const { item } = this.props
    return (
      <View>
        <Image source={{ uri: `file://${item.path}` }} />
      </View>
    )
  }
}
export default class PhotoGrid extends React.Component {
  render () {
    const { data } = this.props
    return (
      <FlatList
        horizontal
        data={data}
        keyExtractor={item => `${item.id}`}
        renderItem={({ item }) => (
          <GridItem item={item} />
        )}
      />
    )
  }
}
