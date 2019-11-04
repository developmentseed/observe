import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import { Dimensions, Keyboard } from 'react-native'
import { PhotoView, ImageDetails } from '../../components/PhotoView'

import Container from '../../components/Container'
import Header from '../../components/Header'
import PageWrapper from '../../components/PageWrapper'
import { colors } from '../../style/variables'
import { NavigationEvents } from 'react-navigation'
import { DescriptionInputField } from '../../components/Input'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { editPhoto } from '../../actions/camera'
import _find from 'lodash.find'

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
  }

  getPhoto = (id) => {
    const { photos } = this.props
    const photo = _find(photos, (p) => { return p.id === id })
    return photo
  }

  componentWillMount = () => {
    const { navigation } = this.props
    const photo = this.getPhoto(navigation.getParam('photo'))
    this.setState({
      description: photo.description
    })
  }

  render () {
    const { navigation, editPhoto } = this.props
    const photoId = this.props.navigation.getParam('photo')
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
          // this.setState({ dialogVisible: true })
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
          <Text>{photo.description}</Text>
        </DescriptionView>
      )
    }

    return (
      <Container>
        <Header back title='Photo Details' navigation={navigation} actions={headerActions} />
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
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    photos: state.photos.photos
  }
}

const mapDispatchToProps = {
  editPhoto
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoDetailScreen)
