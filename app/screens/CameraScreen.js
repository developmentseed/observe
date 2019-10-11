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

class CameraScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Camera'
    }
  }
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back
  }

  async componentWillMount () {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermission: status === 'granted'
    })
  }

  async snap () {
    if (this.camera) {
      let { uri, width, height } = await this.camera.takePictureAsync()
      console.log(uri, width, height)
      this.camera.pausePreview()
    }
  }
  render () {
    const { hasCameraPermission } = this.state
    const { navigation } = this.props
    console.log(hasCameraPermission)
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
                <Icon name='target' size={20} color='#0B3954' />
              </SnapButton>
            </View>
          </Camera>
        </Container>
      )
    }
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen)
