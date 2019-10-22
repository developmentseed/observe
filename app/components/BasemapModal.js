import React from 'react'
import styled from 'styled-components/native'
import { Dimensions, Switch } from 'react-native'
import Icon from './Collecticons'
import ModalSelector from 'react-native-modal-selector'
import Config from 'react-native-config'

const osmLayer = Config.OSM_LAYER_NAME || 'Mapbox Streets'
const satelliteLayer = Config.SATELLITE_LAYER_NAME || 'Mapbox Satellite'

const win = Dimensions.get('window')

const Button = styled.TouchableHighlight`
  position: absolute;
  border-radius: ${Math.round(win.width + win.height) / 2};
  width: 48;
  height: 48;
  right: 16;
  bottom: 130;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  shadow-color: #CECDCD;
  shadow-radius: 3;
  shadow-opacity: 0.7;
  shadow-offset: 0px 0px;
  elevation: 1;
`

const CancelButton = styled.TouchableOpacity`
  margin-top: 2;
  border-radius: 5;
  background-color: 'rgba(255,255,255,0.8)';
  height: 40;
  justify-content: center;
`

const CancelContainer = styled.View`
  align-self: stretch;
  justify-content: center;
  text-align-vertical: center;
`

const CancelText = styled.Text`
  text-align: center;
  color: #333;
`

const Modal = styled.Modal`
  position: absolute;
`

const Container = styled.View``

const Overlay = styled.View`
  flex: 1;
  justify-content: center;
  padding: 5%;
  background-color: 'rgba(0,0,0,0.7)';
`

const View = styled.View`
  flex-shrink: 1;
  border-radius: 5;
  background-color: 'rgba(255,255,255,0.8)';
`
const Text = styled.Text`
`

export default class BasemapModal extends React.Component {
  state = {
    modalVisible: false
  }
  render () {
    return (
      <Container>
        <Button>
          <Icon name='iso-stack' size={20} color='#0B3954' onPress={() => this.setState({ modalVisible: true })} />
        </Button>
        <Modal
          transparent
          visible={this.state.modalVisible}
        >
          <Overlay>
            <View>
              <Switch />
              <Text>Some text</Text>
              <Text>Some text</Text>
              <Text>Some text</Text>
              <Text>Some text</Text>
            </View>
            <CancelContainer>
              <CancelButton>
                <CancelText>Cancel</CancelText>
              </CancelButton>
            </CancelContainer>
          </Overlay>
        </Modal>
      </Container>
    )
  }
  // render () {
  //   let index = 0
  //   // TODO: pick layer names from the json config properly
  //   const data = [
  //     { key: index++, section: true, label: 'Select a basemap' },
  //     { key: index++, label: satelliteLayer, layer: 'satellite' },
  //     { key: index++, label: osmLayer, layer: 'default' }
  //   ]
  //   return (
  //     <ModalSelector
  //       style={{ position: 'absolute', right: 16, bottom: 128 }}
  //       data={data}
  //       cancelText={'Cancel'}
  //       ref={selector => { this.selector = selector }}
  //       onChange={(option) => { this.props.onChange(option.layer) }}
  //       customSelector={
  //         <Button underlayColor='#333'>
  //           <Icon name='iso-stack' size={20} color='#0B3954' onPress={() => this.selector.open()} />
  //         </Button>
  //       } />
  //   )
  // }
}
