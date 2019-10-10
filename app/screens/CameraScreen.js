import React from 'react'
import { connect } from 'react-redux'
import * as Permissions from 'expo-permissions'
import { Camera } from 'expo-camera'
import styled from 'styled-components/native'
import { Dimensions } from 'react-native'
import { Text, View, TouchableOpacity } from 'react-native';

// const View = styled.View``
// const Text = styled.Text``

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

  // async onWillFocus () {
  //   const { status } = await Permissions.askAsync(Permissions.CAMERA)
  //   this.setState({
  //     hasCameraPermission: status === 'granted'
  //   })
  // }
  async componentWillMount () {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermission: status === 'granted'
    })
  }
  // async componentDidMount () {
  //   const { status } = await Permissions.askAsync(Permissions.CAMERA)
  //   this.setState({
  //     hasCameraPermission: status === 'granted'
  //   })
  // }

  render () {
    const { hasCameraPermission } = this.state
    console.log(hasCameraPermission)
    if (hasCameraPermission === null) {
      console.log('HERE')
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
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row'
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center'
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                  })
                }}>
                <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      )
    }
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen)
