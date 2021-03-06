import React from 'react'
import { connect } from 'react-redux'
import Header from '../../components/Header'
import Container from '../../components/Container'
import PhotosList from '../../components/PhotosList'
import { uploadPendingPhotos, clearUploadedPhotos, uploadPendingEdits } from '../../actions/camera'

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
    const { navigation, photos, uploadPendingPhotos, clearUploadedPhotos, uploadPendingEdits } = this.props
    photos.photos.sort((a, b) => b.location.timestamp > a.location.timestamp ? 1 : -1)
    const headerActions = [
      {
        name: 'upload-2',
        onPress: () => {
          uploadPendingPhotos()
          uploadPendingEdits()
        }
      },
      {
        name: 'trash-bin',
        onPress: () => { clearUploadedPhotos() }
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

const mapDispatchToProps = {
  uploadPendingPhotos,
  clearUploadedPhotos,
  uploadPendingEdits
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotosListScreen)
