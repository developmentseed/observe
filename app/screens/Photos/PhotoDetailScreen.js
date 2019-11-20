import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import { PhotoView, ImageDetails } from '../../components/PhotoView'
import Container from '../../components/Container'
import Header from '../../components/Header'
import PageWrapper from '../../components/PageWrapper'
import { DescriptionInputField } from '../../components/Input'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { editPhoto, deletePhoto } from '../../actions/camera'
import _find from 'lodash.find'
import ConfirmDialog from '../../components/ConfirmDialog'
import { NavigationEvents } from 'react-navigation'

const DescriptionView = styled.View`
  padding-top: 10;
`

const DescriptionTitle = styled.Text`
  font-weight: bold;
`
const Text = styled.Text`
  padding-top: 10
`
const View = styled.View`
  height: 100;
  padding-left: 5;
  padding-right: 5;
  padding-top: 5;
  padding-bottom: 5;
`

class PhotoDetailScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Photo Details'
    }
  }

  state = {
    editing: false,
    description: null
    // photo: null
  }

  getPhoto = (id) => {
    const { photos } = this.props
    const photo = _find(photos, (p) => { return p.id === id })
    return photo
  }

  componentWillMount = () => {
    // const { navigation } = this.props
    // const photo = this.getPhoto(navigation.getParam('photo'))
    // console.log('viewing photo', photo)
    // this.setState({
    //   description: photo.description,
    //   photo: photo
    // })
  }

  onWillFocus = () => {
    const { navigation } = this.props
    const photo = this.getPhoto(navigation.getParam('photo'))
    console.log('viewing photo', photo)
    this.setState({
      description: photo.description
    })
  }

  onWillBlur = () => {
    this.setState({
      editing: false,
      description: null,
      photo: null
    })
  }

  cancelDialog = () => {
    this.setState({
      dialogVisible: false
    })
  }

  confirmDelete = async () => {
    const { navigation, deletePhoto } = this.props
    const photo = navigation.getParam('photo')
    this.cancelDialog()
    navigation.navigate('PhotosListScreen')
    deletePhoto(photo)
  }

  render () {
    const { navigation, editPhoto } = this.props
    const previousScreen = navigation.getParam('previousScreen') || 'PhotosListScreen'
    const photoId = navigation.getParam('photo')
    const photo = this.getPhoto(photoId)

    const headerActions = [
      {
        name: this.state.editing ? 'tick' : 'pencil',
        onPress: () => {
          const editing = !this.state.editing
          if (photo.description !== this.state.description) {
            editPhoto(photo, this.state.description)
          }
          this.setState({
            editing: editing
          })
        }
      },
      {
        name: 'trash-bin',
        onPress: () => {
          this.setState({
            dialogVisible: true
          })
        }
      }
    ]

    let showDescription
    if (this.state.editing) {
      showDescription = (
        <DescriptionView>
          <View>
            <DescriptionInputField focus={this.state.editing} value={this.state.description} onValueChange={(value) => this.setState({ description: value })} />
          </View>
        </DescriptionView>
      )
    } else {
      showDescription = (
        <DescriptionView>
          <DescriptionTitle>Description</DescriptionTitle>
          <Text>{this.state.description}</Text>
        </DescriptionView>
      )
    }

    if (photo) {
      return (
        <>
          <NavigationEvents
            onWillFocus={this.onWillFocus}
            onWillBlur={this.onWillBlur}
          />
          <Container>
            <Header back={previousScreen} title='Photo Details' navigation={navigation} actions={headerActions} />
            <KeyboardAwareScrollView
              style={{ backgroundColor: '#fff' }}
              resetScrollToCoords={{ x: 0, y: 0 }}
              scrollEnabled={false}
              extraScrollHeight={100}
              enableOnAndroid
            >
              <PageWrapper>
                <PhotoView path={photo.path} />
                <ImageDetails timestamp={photo.location.timestamp} location={photo.location} />
                {showDescription}
              </PageWrapper>
            </KeyboardAwareScrollView>
            <ConfirmDialog visible={this.state.dialogVisible} title='Delete this photo?' description='This cannot be undone' cancel={this.cancelDialog} continue={this.confirmDelete} />
          </Container>
        </>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => {
  return {
    photos: state.photos.photos
  }
}

const mapDispatchToProps = {
  editPhoto,
  deletePhoto
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoDetailScreen)
