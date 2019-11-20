import React from 'react'
import { Platform, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import Picker from 'react-native-picker-select'
import _uniq from 'lodash.uniq'
import _pick from 'lodash.pick'
import _omitBy from 'lodash.omitby'
import _omit from 'lodash.omit'
import _isEqual from 'lodash.isequal'

import Container from '../../components/Container'
import Header from '../../components/Header'
import PageWrapper from '../../components/PageWrapper'
import TagEditor from '../../components/TagEditor'
import Icon from '../../components/Collecticons'

import { editFeature, uploadEdits } from '../../actions/edit'

import getFeatureFields from '../../utils/get-feature-fields'
import FeatureDetailHeader from '../../components/FeatureDetailHeader'
import { getFieldInput, ReadOnlyField } from '../../components/Input'
import objToArray from '../../utils/object-to-array'
import { metaKeys, nonpropKeys } from '../../utils/uninterestingKeys'
import nextTick from '../../utils/next-tick'
import SaveEditDialog from '../../components/SaveEditDialog'
import getFields from '../../utils/get-fields'
import { getParentPreset } from '../../utils/get-parent-preset'
import getPresetByTags from '../../utils/get-preset-by-tags'
import { colors } from '../../style/variables'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getPhotosForFeature } from '../../utils/photos'
import PhotoGrid from '../../components/PhotoGrid'

const FieldsList = styled.FlatList`
`

const ScrollView = styled.ScrollView`
  background-color: white
`

const View = styled.View`
  padding-left: 10;
  padding-top: 10;
  padding-bottom: 10;
  align-items: flex-start;
  flex-direction: row;
`

const AddPhoto = styled.TouchableOpacity`
  width: 62;
  height: 62;
  border: 0.5px;
  border-color: ${colors.muted}
  border-radius: 4;
  margin-right: 10;
  align-items: center;
  justify-content: center;
`

class EditFeatureDetail extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Set Feature Coordinates'
    }
  }

  state = {
    feature: null,
    fields: null,
    properties: {},
    dialogVisible: false,
    preset: null,
    addFieldValue: null
  }

  componentDidMount () {
    this.props.navigation.addListener('willFocus', payload => {
      this.willFocus()
    })

    this.props.navigation.addListener('willBlur', payload => {
      this.willBlur()
    })
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.navigation.isFocused()
  }

  willFocus () {
    const { navigation } = this.props
    const { state: { params: { feature } } } = navigation
    let { state: { params: { preset } } } = navigation
    let fields = []
    let properties = {}
    if (preset) {
      // change preset of this feature

      const parentPreset = getParentPreset(preset)
      // this is a preset change

      // preset has fields
      if (preset && preset.fields) {
        fields = getFields(preset.fields)
      }

      // if preset doesn't have fields and doesn't have a parent preset
      if (preset && !preset.fields && !parentPreset) {
        fields = []
      }

      // preset doesn't have fields but has parent preset
      if (preset && !preset.fields && parentPreset && parentPreset.fields) {
        fields = getFields(parentPreset.fields)
      }

      // preset and parent preset has fields. combine them.
      if (preset && preset.fields && parentPreset && parentPreset.fields) {
        fields = getFields(_uniq([].concat(preset.fields, parentPreset.fields)))
      }

      const tags = preset.addTags || preset.tags

      const presetTagKeys = Object.keys(tags)
      let presetTags

      if (tags && presetTagKeys.length) {
        presetTags = presetTagKeys.map((key) => {
          const value = tags[key]
          const index = fields.findIndex((f) => f.key === key)

          if (index >= 0) {
            if (value === '*' && fields[index].options && fields[index].options[0]) {
              fields[index].value = fields[index].options[0]
              return
            }
            fields[index].value = value
            return
          }

          return {
            key,
            value
          }
        }).filter((f) => !!f)
      }

      const allFields = presetTags && presetTags.length ? presetTags.concat(fields) : fields

      allFields.forEach((field) => {
        properties[field.key] = field.value
      })

      // remove tags of the previous preset
      feature.properties = _pick(feature.properties, metaKeys)
    } else {
      fields = getFeatureFields(feature)
      preset = getPresetByTags(feature.properties)
    }

    fields.forEach((field) => {
      properties[field.key] = field.value
    })

    this.setState({
      feature,
      fields,
      properties,
      preset
    })
  }

  willBlur () {
    this.resetState()
    this._tageditor.resetState()
  }

  resetState () {
    this.setState({
      feature: null,
      fields: null,
      preset: null,
      properties: {},
      addFieldValue: null
    })
  }

  cancelEditDialog = () => {
    this.setState({ dialogVisible: false })
  }

  saveEditDialog = async (comment) => {
    const { navigation } = this.props
    const { state: { params: { feature } } } = navigation

    this.cancelEditDialog()
    const changesetComment = comment
    Keyboard.dismiss()

    // if we don't do this, the save dialog never clears itself
    await nextTick()

    const newFeature = this.getNewFeature()

    this.props.editFeature(feature, newFeature, changesetComment)
    this.props.uploadEdits([feature.id])

    navigation.navigate('Explore', { message: 'Your edit is being processed.', mode: 'explore' })
  }

  getNewFeature () {
    const { state: { params: { feature, newCoords } } } = this.props.navigation
    const newFeature = {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: [
          ...feature.geometry.coordinates
        ]
      },
      properties: {
        ...feature.properties
      }
    }
    if (newCoords) {
      newFeature.geometry.coordinates = newCoords
    }

    const { version, ndrefs } = newFeature.properties
    newFeature.properties = Object.assign({ version, ndrefs }, this.state.properties)

    // remove undefined props
    newFeature.properties = _omitBy(newFeature.properties, prop => !prop)
    return newFeature
  }

  hasFeatureChanged () {
    const { state: { params: { feature } } } = this.props.navigation
    const newFeature = this.getNewFeature()
    const newOsmTags = _omit(newFeature.properties, nonpropKeys)
    const oldOsmTags = _omit(feature.properties, nonpropKeys)
    return !_isEqual(newOsmTags, oldOsmTags) || !_isEqual(feature.geometry, newFeature.geometry)
  }

  addField (field) {
    const { fields } = this.state
    fields.unshift(field)
    this.setState({ fields })
  }

  getMoreFields () {
    const { fields, preset } = this.state

    const parentPreset = preset ? getParentPreset(preset) : undefined

    let moreFields = []

    // preset doesn't have moreFields, and doesn't have parentPreset
    if (preset && !preset.moreFields && !parentPreset) {
      moreFields = []
    }

    // preset has moreFields, but doesn't have parentPreset
    if (preset && preset.moreFields && !parentPreset) {
      moreFields = getFields([].concat(preset.fields, preset.moreFields))
    }

    // preset doesn't have moreFields, but has parentPreset
    if (preset && !preset.moreFields && parentPreset && parentPreset.moreFields) {
      moreFields = getFields(_uniq([].concat(parentPreset.fields, parentPreset.moreFields)))
    }

    // preset and parent preset has moreFields, combine all fields
    if (preset && preset.moreFields && parentPreset && parentPreset.moreFields) {
      moreFields = getFields(_uniq([].concat(preset.fields, preset.moreFields, parentPreset.fields, parentPreset.moreFields)))
    }

    const existingFieldKeys = (fields && fields.length > 0) ? fields.map((f) => { return f && f.key }) : []

    // TODO: fields dont have a geometry property. how to filter?
    // return getGeometryFields(feature.geometry, allFields).filter((field) => {
    //   return !existingFieldKeys.includes(field.key)
    // })

    if (existingFieldKeys.length > 0) {
      return moreFields.filter((field) => {
        return !existingFieldKeys.includes(field.key)
      })
    } else {
      return moreFields
    }
  }

  renderAddField () {
    const fields = this.getMoreFields()
    if (!fields || !fields.length > 0) return

    return (
      <Picker
        placeholder={{
          label: 'Add a field',
          value: null
        }}
        value={this.state.addFieldValue ? this.state.addFieldValue.value : null}
        items={fields.map((field) => {
          return { label: field.key, value: field.key, key: field.key }
        })}
        onValueChange={(value, i) => {
          if (i !== 0) {
            const field = fields.find((f) => {
              return f && f.key && f.key === value
            })
            if (!field) return
            this.setState({ addFieldValue: field })
            if (Platform.OS === 'android') {
              this.addField(field)
            }
          }
        }}
        onDonePress={() => {
          if (Platform.OS === 'ios' && this.state.addFieldValue) {
            this.addField(this.state.addFieldValue)
            this.setState({ addFieldValue: null })
          }
        }}
        Icon={() => {
          return <Icon name='chevron-down' color='gray' />
        }}
        useNativeAndroidPickerStyle={false}
        style={{
          inputIOS: {
            paddingVertical: 12,
            paddingHorizontal: 10,
            color: colors.base,
            paddingRight: 30,
            marginTop: 10
          },
          inputAndroid: {
            paddingTop: 10,
            paddingBottom: 5,
            paddingHorizontal: 10,
            color: colors.base,
            paddingRight: 30,
            marginTop: 10
          },
          iconContainer: {
            top: 25,
            right: 15
          }
        }}
      />
    )
  }

  renderField (field, feature) {
    const { properties } = this.state
    const { allTags } = this.props

    let FieldInput
    try {
      FieldInput = getFieldInput(field.type)
    } catch (err) {
      console.log(err)
      return
    }

    const property = {
      key: field.key,
      value: properties[field.key]
    }

    if (metaKeys.includes(field.key)) {
      return <ReadOnlyField property={property} />
    }

    const comboFields = ['combo', 'multiCombo', 'typeCombo']
    if (!field.strings && comboFields.includes(field.type)) {
      const matchingTags = allTags.filter((tag) => {
        return tag.key === field.key
      })

      if (matchingTags.length) {
        const options = {}

        matchingTags.forEach((tag) => {
          if (tag.value) {
            options[tag.value] = tag.value
          }
        })

        if (!matchingTags.some((tag) => tag.value === property.value)) {
          options[property.value] = property.value
        }

        field.strings = {
          options
        }
      }
    }

    return (
      <FieldInput
        field={field}
        feature={feature}
        property={property}
        onRemoveField={(key) => {
          // TODO: better handle deleting fields like address
          const fields = this.state.fields
          const props = this.state.properties
          delete props[key]
          const index = fields.findIndex((f) => f.key === key)
          fields.splice(index, 1)
          this.setState({ properties: props, fields })
        }}
        onUpdate={({ properties }) => {
          this.setState({
            properties: Object.assign(this.state.properties, properties)
          })
        }}
      />
    )
  }

  renderFields () {
    const { feature, fields } = this.state

    if (!feature || !fields || !fields.length) {
      return
    }

    return (
      <FieldsList
        data={fields}
        renderItem={({ item }) => this.renderField(item, feature)}
        keyExtractor={(item, i) => `field-${i}-${item.key}`}
      />
    )
  }

  onTagEditorUpdate = (properties) => {
    const propertyObj = {}

    properties.reduce((obj, prop) => {
      obj[prop.key] = prop.value
      return obj
    }, propertyObj)

    this.setState({
      properties: Object.assign({}, (this.state.properties || {}), propertyObj)
    })
  }

  createTagEditorProperties () {
    const { properties, fields } = this.state

    const tagEditorProperties = Object.keys(properties)
      .filter((key) => {
        if (fields.some((f) => f.key === key)) return false
        return true
      })
      .map((key) => {
        return { key, value: properties[key] }
      })

    return tagEditorProperties
  }

  onPressAddPhoto = () => {
    const { navigation } = this.props
    const { state: { params: { feature } } } = navigation
    navigation.navigate('CameraScreen', { feature: feature, previousScreen: 'EditFeatureDetail' })
  }
  render () {
    const { preset } = this.state
    const { navigation, photos } = this.props
    const { state: { params: { feature } } } = navigation
    const title = feature.properties.name || feature.id
    const featurePhotos = getPhotosForFeature(photos, feature.id)

    let headerActions = []

    if (this.hasFeatureChanged()) {
      headerActions.push({
        name: 'tick',
        onPress: () => {
          Keyboard.dismiss()
          this.setState({ dialogVisible: true })
        }
      })
    }

    return (
      <Container>
        <ScrollView
          keyboardShouldPersistTaps='handled'
          stickyHeaderIndices={[0]}
          bounces={false}
        >
          <Header
            back
            title={title}
            navigation={navigation}
            actions={headerActions}
          />
          <FeatureDetailHeader
            preset={preset}
            feature={feature}
            navigation={navigation}
          />
          <KeyboardAwareScrollView
            style={{ backgroundColor: '#fff' }}
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled
            extraScrollHeight={150}
            enableOnAndroid
            keyboardShouldPersistTaps='handled'
          >
            <PageWrapper
            >
              {this.renderFields()}
              {this.renderAddField()}
            </PageWrapper>
            <TagEditor ref={(ref) => (this._tageditor = ref)} properties={this.createTagEditorProperties()} onUpdate={this.onTagEditorUpdate} />
            <View>
              <AddPhoto onPress={this.onPressAddPhoto} >
                <Icon name='camera' color='gray' size={25} />
              </AddPhoto>
              <PhotoGrid data={featurePhotos} />
            </View>
          </KeyboardAwareScrollView>
          <SaveEditDialog visible={this.state.dialogVisible} cancel={this.cancelEditDialog} save={this.saveEditDialog} />
        </ScrollView>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    allFields: objToArray(state.presets.fields),
    allTags: state.presets.tags,
    presets: state.presets.presets,
    photos: state.photos.photos
  }
}

const mapDispatchToProps = {
  editFeature,
  uploadEdits
}

export default connect(mapStateToProps, mapDispatchToProps)(EditFeatureDetail)
