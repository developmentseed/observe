import React from 'react'
import { Dimensions } from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import Search from 'react-native-search-box'

import objToArray from '../../utils/object-to-array'
import Header from '../../components/Header'
import Container from '../../components/Container'
import PageWrapper from '../../components/PageWrapper'

import { colors } from '../../style/variables'
import { presets as starterPresets } from '../../presets/starter-presets.json'

const win = Dimensions.get('window')

const Text = styled.Text`
  font-size: 16;
  letter-spacing: 0.5;
  color: ${colors.base};
`

const PresetWrapper = styled.TouchableOpacity`
  border-bottom-width: 0.5;
  border-bottom-color: #efefef;
  padding-top: 12;
  padding-bottom: 12;
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const PresetList = styled.ScrollView`
  flex: 1;
`

const IconCircle = styled.View`
  border-radius: ${Math.round(win.width + win.height) / 2};
  width: 36;
  height: 36;
  background-color: ${colors.primary};
  margin-right: 16;
  justify-content: center;
  align-items: center;
`

const Icon = styled.Image`
  width: 20;
  height: 20;
  align-self: center;
`

const SearchWrapper = styled.View`
  margin-bottom: 8;
`

class SelectFeatureType extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Select Feature Type'
    }
  }

  state = {
    presets: [],
    searchText: null
  }

  resetState () {
    this.setState({
      presets: [],
      searchText: null
    })
  }

  componentDidMount () {
    this.props.navigation.addListener('willBlur', payload => {
      this.resetState()
    })
  }

  renderPreset (preset, i) {
    const { navigation } = this.props
    const { state: { params: { feature } } } = navigation
    function onPress () {
      if (!feature.id.includes('observe-')) {
        // go to editfeaturedetail
        navigation.navigate('EditFeatureDetail', { feature, preset })
      } else {
        navigation.navigate('AddFeatureDetail', {
          feature,
          preset
        })
      }
    }

    return (
      <PresetWrapper key={`preset-${i}-${preset.key}`} onPress={onPress}>
        <IconCircle>
          {
            preset.icon && (<Icon source={{ uri: preset.icon.replace('-', '_') }} />)
          }
        </IconCircle>
        <Text>{preset.name}</Text>
      </PresetWrapper>
    )
  }

  getFilteredPresets (presets, text) {
    if (!text || !presets || !presets.length || text.length < 3) {
      return objToArray(starterPresets)
    }

    return presets.filter((preset) => {
      return preset.name.toLowerCase().includes(text.toLowerCase())
    })
  }

  renderPresets () {
    const { presets, searchText } = this.state

    const filteredPresets = this.getFilteredPresets(presets, searchText)

    return (
      <PresetList>
        {filteredPresets.map((item, i) => this.renderPreset(item, i))}
      </PresetList>
    )
  }

  static getDerivedStateFromProps (props, state) {
    if (state.presets.length !== props.presets.length) {
      state.presets = objToArray(props.presets)
        .filter((preset) => preset.geometry.includes('point'))
        .sort((a, b) => {
          var nameA = a.name.toLowerCase()
          var nameB = b.name.toLowerCase()
          if (nameA < nameB) return -1
          if (nameA > nameB) return 1
          return 0
        })
    }

    return state
  }

  onSearch (text) {
    this.setState({ searchText: text })
  }

  render () {
    const { navigation } = this.props
    return (
      <Container>
        <Header
          back
          title='Select feature type'
          navigation={navigation}
        />
        <PageWrapper>
          <SearchWrapper>
            <Search
              onSearch={(text) => this.onSearch(text)}
              onChangeText={(text) => this.onSearch(text)}
              backgroundColor='#ffffff'
              titleCancelColor='#333333'
              contentWidth={win.width - 32}
              inputStyle={{ paddingBottom: 6, fontSize: 16, paddingLeft: 2 }}
              keyboardShouldPersist={false}
              placeholder='Search for presets'
              searchIconCollapsedMargin={55}
              searchIconExpandedMargin={10}
              placeholderCollapsedMargin={45}
              placeholderExpandedMargin={20}
            />
          </SearchWrapper>
          {this.renderPresets()}
        </PageWrapper>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    presets: state.presets.presets
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(SelectFeatureType)
