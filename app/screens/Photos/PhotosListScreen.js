import React from 'react'
import { connect } from 'react-redux'
import Header from '../../components/Header'
import Container from '../../components/Container'
import PhotosList from '../../components/PhotosList'

class PhotosListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Your Photos'
    }
  }

  select = photo => {
    const { navigation } = this.props
    navigation.navigate({ routeName: 'PhotoDetailScreen', params: { photo: photo.id, previousScreen: 'PhotosListScreen' } })
  }

  render () {
    const { navigation, photos } = this.props
    const headerActions = [
      {
        name: 'upload-2',
        onPress: () => { console.log('upload') }
      },
      {
        name: 'trash-bin',
        onPress: () => { console.log('trash') }
      }
    ]
    return (
      <Container>
        <Header
          title='Your Photos'
          navigation={navigation}
          actions={headerActions}
        />
        <PhotosList
          data={photos.photos}
          onSelectItem={this.select}
        />

      </Container>
    )
  }
}

const mapStateToProps = state => ({
  photos: state.photos
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(PhotosListScreen)
