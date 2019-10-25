import React from 'react'
import { connect } from 'react-redux'
import * as Permissions from 'expo-permissions'
import { Camera } from 'expo-camera'
import styled from 'styled-components/native'
import { Dimensions, Text, View } from 'react-native'
import Container from '../components/Container'
import Header from '../components/Header'
import getPlatformStyles from '../utils/get-platform-styles'
import Icon from '../components/Collecticons'
import { colors } from '../style/variables'
import { savePhoto } from '../actions/camera'
import * as Location from 'expo-location'
import LoadingOverlay from '../components/LoadingOverlay'

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
const ImageBackground = styled.ImageBackground``

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
    image: null
  }

  async componentWillMount () {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermission: status === 'granted'
    })
  }

  async snap () {
    if (this.camera) {
      this.setState({
        saving: true
      })
      let { uri, width, height } = await this.camera.takePictureAsync()
      const location = await Location.getCurrentPositionAsync({})
      console.log(uri, width, height, location)
      // this.props.savePhoto(uri, location)
      // this.camera.pausePreview()
      this.setState({
        saving: false
      })
      this.setState({
        image: uri
      })
      this.camera.resumePreview()
    }
  }
  render () {
    const { hasCameraPermission } = this.state
    const { navigation } = this.props
    let showLoadingIndicator = null
    if (this.state.saving) {
      showLoadingIndicator = (
        <LoadingOverlay />
      )
    }

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
          <Header back={() => this.setState({ image: null })} title='Save picture' navigation={navigation} />
          <View>
            <ImageBackground
              source={{ uri: this.state.image }}
            />
          </View>
        </Container>
      )
    } else {
      return (
        <Container>
          <Header back title='Take a picture' navigation={navigation} />
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
