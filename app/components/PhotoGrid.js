import React from 'react'
import styled from 'styled-components/native'
import { colors } from '../style/variables'
import Icon from '../components/Collecticons'

const FlatList = styled.FlatList`
  padding-bottom: 30;
`

const Container = styled.TouchableHighlight`
  margin-right: 10;
`
const Image = styled.Image`
  width: 60;
  height: 60;
  border: 0.5px;
  border-radius: 4;
  resize-mode: contain;
`
const View = styled.View`
  padding-left: 10;
  padding-top: 10;
  padding-bottom: 10;
  align-items: flex-start;
  flex-direction: row;
  background-color: white;
`
const AddPhoto = styled.TouchableOpacity`
  width: 60;
  height: 60;
  border: 0.5px;
  border-color: ${colors.muted}
  border-radius: 4;
  margin-right: 10;
  align-items: center;
  justify-content: center;
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
  onPressAddPhoto = () => {
    const { navigation, previousScreen, feature } = this.props
    navigation.navigate('CameraScreen', { feature: feature, previousScreen: previousScreen })
  }

  openPhoto = photo => {
    const { navigation, previousScreen } = this.props
    navigation.navigate({ routeName: 'PhotoDetailScreen', params: { photo: photo.id, previousScreen: previousScreen } })
  }

  render () {
    const { data } = this.props
    return (
      <View>
        <AddPhoto onPress={this.onPressAddPhoto} >
          <Icon name='camera' color='gray' size={25} />
        </AddPhoto>
        <FlatList
          horizontal
          data={data}
          keyExtractor={item => `${item.id}`}
          renderItem={({ item }) => (
            <GridItem
              onPress={this.openPhoto}
              item={item}
            />
          )}
        />
      </View>
    )
  }
}
