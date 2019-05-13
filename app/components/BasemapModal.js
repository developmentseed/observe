import React from 'react'
import styled from 'styled-components/native'
import { Dimensions } from 'react-native'
import Icon from './Collecticons'
import ModalSelector from 'react-native-modal-selector'
import Config from 'react-native-config'

const osmLayer = Config.OSM_LAYER_NAME || 'Mapbox Streets'
const satelliteLayer = Config.SATELLITE_LAYER_NAME || 'Mapbox Satellite'

const win = Dimensions.get('window')

const Button = styled.TouchableHighlight`
  border-radius: ${Math.round(win.width + win.height) / 2};
  width: 48;
  height: 48;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  shadow-color: #CECDCD;
  shadow-radius: 3;
  shadow-opacity: 0.7;
  shadow-offset: 0px 0px;
  elevation: 1;
`

export default class BasemapModal extends React.Component {
  render () {
    let index = 0
    // TODO: pick layer names from the json config properly
    const data = [
      { key: index++, section: true, label: 'Select a basemap' },
      { key: index++, label: satelliteLayer, layer: 'satellite' },
      { key: index++, label: osmLayer, layer: 'default' }
    ]
    return (
      <ModalSelector
        style={{ position: 'absolute', right: 16, bottom: 128 }}
        data={data}
        cancelText={'Cancel'}
        ref={selector => { this.selector = selector }}
        onChange={(option) => { this.props.onChange(option.layer) }}
        customSelector={
          <Button underlayColor='#333'>
            <Icon name='iso-stack' size={20} color='#0B3954' onPress={() => this.selector.open()} />
          </Button>
        } />
    )
  }
}
