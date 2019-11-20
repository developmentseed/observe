import React from 'react'
import styled from 'styled-components/native'

const FlatList = styled.FlatList`
  padding-bottom: 30;
`

const Container = styled.TouchableHighlight`
  border: 0.5px;
  margin-right: 10;
`
const Image = styled.Image`
  width: 60;
  height: 60;
  resize-mode: contain;
`

class GridItem extends React.Component {
  _onPress = () => {
    this.props.onPress && this.props.onPress(this.props.item)
  }

  render () {
    const { item } = this.props
    return (
      <Container onPress={this._onPress}>
        <Image source={{ uri: `file://${item.path}` }} />
      </Container>
    )
  }
}

export default class PhotoGrid extends React.Component {
  render () {
    const { data, onSelect } = this.props
    return (
      <FlatList
        horizontal
        data={data}
        keyExtractor={item => `${item.id}`}
        renderItem={({ item }) => (
          <GridItem
            onPress={onSelect}
            item={item}
          />
        )}
      />
    )
  }
}
