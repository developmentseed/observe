import React from 'react'
import { Platform, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import _omitBy from 'lodash.omitby'
import _omit from 'lodash.omit'
import _uniq from 'lodash.uniq'
import styled from 'styled-components/native'
import Picker from 'react-native-picker-select'

import Container from '../../components/Container'
import Header from '../../components/Header'
import PageWrapper from '../../components/PageWrapper'

import { addFeature, uploadEdits } from '../../actions/edit'
import getFields from '../../utils/get-fields'
import { getFieldInput, ReadOnlyField } from '../../components/Input'
import objToArray from '../../utils/object-to-array'
import { metaKeys } from '../../utils/uninterestingKeys'
import nextTick from '../../utils/next-tick'
import SaveEditDialog from '../../components/SaveEditDialog'
import TagEditor from '../../components/TagEditor'

import { getParentPreset } from '../../utils/get-parent-preset'

const FieldsList = styled.FlatList``

class EditFeatureDetail extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Set Feature Coordinates',
      dialogVisible: false
    }
  }

  state = {
    feature: null,
    fields: null,
    preset: null,
    properties: null,
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
    const { state: { params: { feature, preset } } } = navigation
    const parentPreset = preset ? getParentPreset(preset) : undefined
    let fields = []

    // if no preset
    if (!preset) {
      fields = []
    }

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

    const properties = {}
    allFields.forEach((field) => {
      properties[field.key] = field.value
    })

    this.setState({
      fields: allFields,
      feature,
      properties,
      preset
    })
  }

  cancelEditDialog = () => {
    this.setState({ dialogVisible: false })
  }

  saveEditDialog = async (comment) => {
    const { navigation } = this.props
    const { state: { params: { feature } } } = navigation

    this.cancelEditDialog()
    Keyboard.dismiss()

    // if we don't do this, the save dialog never clears itself
    await nextTick()

    feature.properties = this.getFeatureProperties()

    // call addFeature action with feature
    this.props.addFeature(feature, comment)

    // call action to attempt to upload the edit
    this.props.uploadEdits([feature.id])
    navigation.navigate('Explore', { message: 'Your edit is being processed.', mode: 'explore' })
  }

  isFeatureEmpty () {
    const props = this.getFeatureProperties()
    const osmTags = _omit(props, ['id', 'version'])
    return Object.keys(osmTags).length === 0
  }

  getFeatureProperties () {
    const { state: { params: { feature } } } = this.props.navigation
    const props = Object.assign({}, feature.properties, this.state.properties)
    return _omitBy(props, prop => !prop)
  }

  willBlur () {
    this.resetState()
  }

  resetState () {
    this.setState({
      feature: null,
      fields: null,
      preset: null,
      properties: null,
      addFieldValue: null
    })
  }

  addField (field) {
    const { fields } = this.state
    fields.unshift(field)
    this.setState({ fields })
  }

  getMoreFields () {
    const { preset, fields } = this.state
    const parentPreset = preset ? getParentPreset(preset) : undefined
    if (!fields) return []

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
      moreFields = getFields(parentPreset.moreFields)
    }

    // preset and parent preset has moreFields, combine them
    if (preset && preset.moreFields && parentPreset && parentPreset.moreFields) {
      moreFields = getFields(_uniq([].concat(preset.moreFields, parentPreset.moreFields)))
    }

    const existingFieldKeys = fields.map((f) => { return f && f.key })

    return moreFields.filter((field) => {
      return !existingFieldKeys.includes(field.key)
    })
  }

  renderAddField () {
    const fields = this.getMoreFields()
    if (!fields || !fields.length > 0) return

    let value = {
      label: 'Add a field',
      value: null
    }

    return (
      <Picker
        placeholder={{
          label: 'Add a field',
          value: null
        }}
        value={this.state.addFieldValue ? this.state.addFieldValue.value : null}
        items={fields.map((field) => {
          return { label: field.key, value: field.key }
        })}
        onValueChange={(val, i) => {
          if (val) {
            const field = fields.find((f) => {
              return f && f.key === val
            })
            value = { label: field.key, value: field.key }
            this.setState({ addFieldValue: value })
            if (Platform.OS === 'android') {
              this.addField(field)
            }
          }
        }}
        onDonePress={() => {
          if (Platform.OS === 'ios') {
            const field = fields.find((f) => {
              return f && f.key === this.state.addFieldValue.value
            })
            this.addField(field)
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
          this.setState({ addFieldValue: null })
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

  render () {
    const { properties } = this.state
    const { navigation } = this.props
    if (!properties) return null
    let headerActions = []

    if (!this.isFeatureEmpty()) {
      headerActions.push({
        name: 'tick',
        onPress: () => {
          this.setState({ dialogVisible: true })
        }
      })
    }

    return (
      <Container>
        <Header
          back
          title='Add Point'
          navigation={navigation}
          actions={headerActions}
        />
        <TagEditor properties={this.createTagEditorProperties()} onUpdate={this.onTagEditorUpdate} />
        <PageWrapper>
          {this.renderAddField()}
          {this.renderFields()}
        </PageWrapper>
        <SaveEditDialog visible={this.state.dialogVisible} cancel={this.cancelEditDialog} save={this.saveEditDialog} />
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    allFields: objToArray(state.presets.fields),
    allTags: state.presets.tags
  }
}

const mapDispatchToProps = {
  addFeature,
  uploadEdits
}

export default connect(mapStateToProps, mapDispatchToProps)(EditFeatureDetail)
