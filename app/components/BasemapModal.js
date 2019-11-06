import React from 'react'
import styled from 'styled-components/native'
import { Dimensions, Switch, findNodeHandle } from 'react-native'
import Icon from './Collecticons'
import Config from 'react-native-config'
import { colors } from '../style/variables'
import { connect } from 'react-redux'
import { toggleOverlay } from '../actions/map'

const mapLayers = {
  'default': Config.OSM_LAYER_NAME || 'Mapbox Streets',
  'satellite': Config.SATELLITE_LAYER_NAME || 'Mapbox Satellite'
}

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

const Modal = styled.Modal`
  position: absolute;
`

const Container = styled.View``

const OverlayBackdrop = styled.TouchableWithoutFeedback`
`
const OverlayInner = styled.View`
  flex: 1;
  justify-content: center;
  padding: 10%;
  background-color: 'rgba(0,0,0,0.2)';
`

const View = styled.View`
  flex-shrink: 1;
  border-radius: 5;
  background-color: white;
  padding-left: 10;
  padding-right: 10;
  padding-top: 10;
  padding-bottom: 10;
`

const OverlaySection = styled.View`
  padding-left: 10;
  padding-right: 10;
  padding-top: 10;
  padding-bottom: 10;
  border-bottom-width: 0.5;
  border-bottom-color: ${colors.muted};
`

const BasemapSection = styled.View`
  padding-left: 10;
  padding-right: 10;
  padding-top: 10;
  padding-bottom: 10;
`

const SectionTitle = styled.Text`
  font-size: 14;
  color: ${colors.muted}
  letter-spacing: 1;
  margin-top: 10;
  margin-bottom: 10;
  padding-left: 10;
  padding-right: 10;
  padding-top: 10;
  padding-bottom: 10;
`
const SwitchSection = styled.View`
  flex-direction: row;
  align-content: center;
  align-items: center;
  padding-left: 5;
  padding-right: 5;
  padding-top: 5;
  padding-bottom: 5;
`

const LayerName = styled.Text`
  margin-left: 10;
  font-size: 20;
`

const CurrentLayerName = styled.Text`
  margin-left: 10;
  font-size: 20;
  color: ${colors.primary}
`

const BasemapItem = styled.TouchableOpacity`
  width: ${win.width}
`
class BasemapModal extends React.Component {
  state = {
    modalVisible: false
  }

  onPress = (event) => {
    // Handler for making sure the modal will be closed if pressed in the backdrop
    let elementHandle = findNodeHandle(this.refs['overlay'])
    if (elementHandle === event.nativeEvent.target) {
      this.setState({ modalVisible: false })
    }
  }

  getNameStyle = (name) => {
    const currentBaseLayer = this.props.currentBaseLayer || 'default'
    if (name === currentBaseLayer) {
      return (
        <CurrentLayerName>{mapLayers[name]}</CurrentLayerName>
      )
    } else {
      return (
        <LayerName>{mapLayers[name]}</LayerName>
      )
    }
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
          <OverlayBackdrop ref='overlay' onPress={(event) => { this.onPress(event) }}>
            <OverlayInner>
              <View>
                <OverlaySection>
                  <SectionTitle>OVERLAYS</SectionTitle>
                  <SwitchSection>
                    <Switch
                      onValueChange={() => { this.props.toggleOverlay('osm') }}
                      value={this.props.overlays['osm']}
                    />
                    <LayerName>OSM Data</LayerName>
                  </SwitchSection>
                  <SwitchSection>
                    <Switch
                      onValueChange={() => { this.props.toggleOverlay('traces') }}
                      value={this.props.overlays['traces']}
                      disabled
                    />
                    <LayerName>Your Traces</LayerName>
                  </SwitchSection>
                  <SwitchSection>
                    <Switch
                      onValueChange={() => { this.props.toggleOverlay('photos') }}
                      value={this.props.overlays['photos']}
                      disabled
                    />
                    <LayerName>Your Photos</LayerName>
                  </SwitchSection>
                </OverlaySection>
                <BasemapSection>
                  <SectionTitle>BASEMAP</SectionTitle>
                  <SwitchSection>
                    <BasemapItem onPress={() => { this.props.onChange('default') }}>
                      {this.getNameStyle('default')}
                    </BasemapItem>
                  </SwitchSection>
                  <SwitchSection>
                    <BasemapItem onPress={() => { this.props.onChange('satellite') }}>
                      {this.getNameStyle('satellite')}
                    </BasemapItem>
                  </SwitchSection>
                </BasemapSection>
              </View>
            </OverlayInner>
          </OverlayBackdrop>
        </Modal>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  currentBaseLayer: state.map.baseLayer,
  overlays: state.map.overlays
})

const mapDispatchToProps = {
  toggleOverlay
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BasemapModal)
