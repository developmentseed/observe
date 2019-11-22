import React from 'react'
import { connect } from 'react-redux'
import * as Permissions from 'expo-permissions'
import { Camera } from 'expo-camera'
import styled from 'styled-components/native'
import { Dimensions, Text } from 'react-native'
import Container from '../components/Container'
import Header from '../components/Header'
import getPlatformStyles from '../utils/get-platform-styles'
import Icon from '../components/Collecticons'
import { colors } from '../style/variables'
import { savePhoto } from '../actions/camera'
import * as Location from 'expo-location'
import LoadingOverlay from '../components/LoadingOverlay'
import { DescriptionInputField } from '../components/Input'
import PageWrapper from '../components/PageWrapper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { PhotoView, ImageDetails } from '../components/PhotoView'

const win = Dimensions.get('window')
const buttonStyles = getPlatformStyles({
  ios: {
    bottom: 100
  },
  iphoneX: {
    bottom: 100
  },
  android: {
    bottom: 20
  }
})

const SnapButton = styled.TouchableHighlight`
  position: absolute;
  border-radius: ${Math.round(win.width + win.height) / 2};
  width: 60;
  height: 60;
  background-color: ${colors.primary};
  right: 40%;
  bottom: ${buttonStyles.bottom};
  justify-content: center;
  align-items: center;
  shadow-color: grey;
  shadow-opacity: 0.7;
  shadow-offset: 0px 0px;
`

const View = styled.View`
  height: 100;
  padding-left: 5;
  padding-right: 5;
  padding-top: 5;
  padding-bottom: 5;
`

class CameraScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Camera'
    }
  }
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    saving: false,
    image: null,
    location: null,
    description: null,
    feature: null
  }

  async componentWillMount () {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    const { navigation } = this.props
    const { state: { params: { feature } } } = navigation
    this.setState({
      hasCameraPermission: status === 'granted',
      image: null,
      location: null,
      description: null,
      feature: feature
    })
  }

  async snap () {
    if (this.camera) {
      let { uri, width, height } = await this.camera.takePictureAsync()
      const location = await Location.getCurrentPositionAsync({})
      console.log(uri, width, height, location)
      this.setState({
        image: uri,
        location: location
      })
    }
  }
  render () {
    const { hasCameraPermission } = this.state
    const { navigation } = this.props
    const previousScreen = navigation.getParam('previousScreen')

    let showLoadingIndicator = null
    if (this.state.saving) {
      showLoadingIndicator = (
        <LoadingOverlay />
      )
    }

    const headerActions = [
      {
        name: 'tick',
        onPress: () => {
          this.setState({
            saving: true
          })
          if (this.state.feature) {
            this.props.savePhoto(this.state.image, this.state.location, this.state.description, this.state.feature.id)
          } else {
            this.props.savePhoto(this.state.image, this.state.location, this.state.description, null)
          }
          this.setState({
            image: null,
            location: null,
            description: null
          })
          navigation.navigate(previousScreen)
        }
      }
    ]

    if (hasCameraPermission === null) {
      return (
        <View>
          <Text>No access to camera</Text>
        </View>
      )
    } else if (hasCameraPermission === false) {
      return (
        <View>
          <Text>No access to camera</Text>
        </View>
      )
    } else if (this.state.image) {
      return (
        <Container>
          <Header back={() => this.setState({ image: null, location: null, description: null })} title='Save picture' navigation={navigation} actions={headerActions} />
          <KeyboardAwareScrollView
            style={{ backgroundColor: '#fff' }}
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={false}
            extraScrollHeight={100}
            enableOnAndroid
          >
            <PageWrapper>
              <PhotoView path={this.state.image} />
              <ImageDetails timestamp={this.state.location.timestamp} location={this.state.location} />
              <View>
                <DescriptionInputField value={this.state.description} onValueChange={(value) => this.setState({ description: value })} />
              </View>
            </PageWrapper>
          </KeyboardAwareScrollView>
        </Container>
      )
    } else {
      return (
        <Container>
          <Header back={previousScreen} title='Take a picture' navigation={navigation} />
          <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => { this.camera = ref }} >
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row'
              }} >
              <SnapButton onPress={() => { this.snap() }}>
                <Icon name='camera' size={20} color='#0B3954' />
              </SnapButton>
            </View>
          </Camera>
          { showLoadingIndicator }
        </Container>
      )
    }
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {
  savePhoto
}
export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen)
