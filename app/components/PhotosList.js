import React from 'react'
import styled from 'styled-components/native'
import Container from '../components/Container'
import PhotosItem from '../components/PhotosItem'

const TextContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const Text = styled.Text``

const StyledFlatList = styled.FlatList``

export default class PhotosList extends React.Component {
  render () {
    const { data, onSelectItem } = this.props
    if (data && !data.length) {
      return (
        <Container>
          <TextContainer>
            <Text>No photos to display.</Text>
          </TextContainer>
        </Container>
      )
    }

    return (
      <StyledFlatList
        data={data}
        keyExtractor={item => `${item.id}`}
        renderItem={({ item }) => (
          <PhotosItem
            item={item}
            onPress={onSelectItem}
          />
        )}
      />
    )
  }
}
