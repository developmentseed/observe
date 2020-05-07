import React, { Component } from 'react'
import { Platform, Switch, TextInput, View } from 'react-native'
import DatePicker from 'react-native-datepicker'
import _uniq from 'lodash.uniq'
import styled from 'styled-components/native'
import { colors } from '../style/variables'
import Icon from './Collecticons'
import Picker from 'react-native-picker-select'

const FieldWrapper = styled.View`
  border-width: 1;
  border-color: ${colors.baseMuted};
  border-radius: 4;
  margin-top: 16;
  flex: 1;
  flex-direction: row;
  flex-shrink: 0;
`

const LabelWrapper = styled.View`
  align-self: flex-start;
  background-color: white;
  margin-top: -10;
  position: absolute;
  left: 12;
  padding-right: 4;
  padding-left: 4;
`

const Label = styled.Text`
  color: ${colors.baseMuted};
  letter-spacing: 0.4;
`

const InputWrapper = styled.View`
  padding-left: 9;
  flex: 0.9;
  height: 45;
  justify-content: center;
`

const FieldDeleteWrapper = styled.TouchableHighlight`
  flex: 0.1;
  border-width: 0;
  border-color: ${colors.baseMuted};
  border-left-width: 1;
  align-items: center;
  justify-content: center;
  background-color: white;
`

const FieldGroup = styled.View`
  padding-left: 10;
  padding-right: 10;
  padding-top: 10;
  padding-bottom: 10;
  border-width: 1;
  border-color: ${colors.baseMuted};
  border-radius: 4;
  margin-top: 16;
`

class Field extends Component {
  state = { color: colors.baseMuted }

  onFocus () {
    this.setState({
      color: colors.primary
    })
  }

  onBlur () {
    this.setState({
      color: colors.baseMuted
    })
  }

  onValueChange (value) {
    const { field: { key }, onUpdate } = this.props
    onUpdate({
      properties: {
        [key]: value
      }
    })

    this.setState({ value })
  }

  removeField (key) {
    this.props.onRemoveField(key)
  }

  setNativeProps (nativeProps) {
    this._root.setNativeProps(nativeProps)
  }
}

export class CheckField extends Field {
  render () {
    const { property, field: { key } } = this.props
    const { color } = this.state
    const value = this.state.value || property.value

    return (
      <View ref={x => (this._root = x)} style={{ flex: 1, height: 64 }}>
        <FieldWrapper style={{ borderColor: color }}>
          <LabelWrapper>
            <Label style={{ color }}>{key}</Label>
          </LabelWrapper>

          <InputWrapper style={{ alignSelf: 'center' }}>
            <Switch
              onValueChange={(value) => this.onValueChange(value)}
              onFocus={() => this.onFocus()}
              onBlur={() => this.onBlur()}
              value={value}
              trackColor={{ false: colors.baseMuted, true: colors.primary }}
              thumbColor={colors.primary}
            />
          </InputWrapper>
          <FieldDeleteWrapper onPress={() => this.removeField(key)}>
            <Icon name='trash-bin' size={16} color={colors.baseMuted} />
          </FieldDeleteWrapper>
        </FieldWrapper>
      </View>
    )
  }
}

export class PickerField extends Field {
  getPickerItems () {
    const { field } = this.props

    const options = field.options || (field.strings && field.strings.options)

    if (Array.isArray(options)) {
      return options.map((opt, idx) =>
        <Picker.Item key={idx} label={opt} value={opt} />
      )
    }

    return Object.keys(options).map((k, idx) =>
      <Picker.Item key={idx} label={options[k]} value={k} />
    )
  }

  render () {
    const { property, field: { key, label }, field } = this.props
    const { color } = this.state
    const options = field.options || (field.strings && field.strings.options)

    let pickerOptions
    if (Array.isArray(options)) {
      pickerOptions = options.map((option) => {
        return { label: option, value: option, key: option }
      })
    } else {
      pickerOptions = Object.keys(options).map((k, idx) => {
        return { label: options[k], value: k, key: k }
      })
    }

    const value = this.state.value || property.value

    if (!options) {
      return null
    }

    return (
      <View ref={x => (this._root = x)} style={{ flex: 1, height: 64 }}>
        <FieldWrapper style={{ borderColor: color, height: 64 }}>
          <LabelWrapper style={{ borderColor: color }}>
            <Label style={{ color }}>{label || key}</Label>
          </LabelWrapper>

          <InputWrapper style={{ flex: 1 }}>
            <Picker
              placeholder={{
                label: 'Select an option',
                value: null
              }}
              items={pickerOptions}
              value={value}
              onValueChange={(value, i) => {
                if (i !== 0) {
                  this.onValueChange(value)
                }
              }}
              onDonePress={() => {
                if (Platform.OS === 'ios') {
                  this.onValueChange(value)
                }
              }}
              onFocus={() => this.onFocus()}
              onBlur={() => this.onBlur()}
              prompt={label}
              selectedValue={value}
              style={{ flex: 1, height: 64 }}
            >
              {/* <Picker.Item label='select' value='select' /> */}
              {/* {this.getPickerItems()} */}
            </Picker>
          </InputWrapper>
          <FieldDeleteWrapper onPress={() => this.removeField(key)}>
            <Icon name='trash-bin' size={16} color={colors.baseMuted} />
          </FieldDeleteWrapper>
        </FieldWrapper>
      </View>
    )
  }
}

export class ComboField extends Field {
  render () {
    const { field: { strings } } = this.props

    const hasOptions = strings && strings.options &&
      (
        (typeof strings.options === 'object' && Object.keys(strings.options).length) ||
        strings.options.length
      )

    if (hasOptions) {
      return <PickerField {...this.props} />
    }

    return <TextField {...this.props} />
  }
}

export class NumberField extends Field {
  render () {
    const { property, field: { key, label, placeholder } } = this.props
    const { color } = this.state
    const value = this.state.value || property.value

    return (
      <View ref={x => (this._root = x)}>
        <FieldWrapper style={{ borderColor: color }}>
          <LabelWrapper>
            <Label style={{ color }}>{label || key}</Label>
          </LabelWrapper>

          <InputWrapper>
            <TextInput
              onChangeText={(value) => this.onValueChange(value)}
              onFocus={() => this.onFocus()}
              onBlur={() => this.onBlur()}
              keyboardType='numeric'
              placeholder={placeholder}
              placeholderTextColor={color.baseMuted}
              underlineColorAndroid='transparent'
              value={value}
            />
          </InputWrapper>
          <FieldDeleteWrapper onPress={() => this.removeField(key)}>
            <Icon name='trash-bin' size={16} color={colors.baseMuted} />
          </FieldDeleteWrapper>
        </FieldWrapper>
      </View>
    )
  }
}

export class TextField extends Field {
  render () {
    const { property, field: { key, placeholder } } = this.props
    const { color } = this.state
    const value = this.state.value || property.value

    return (
      <View ref={x => (this._root = x)} style={{ flex: 1 }}>
        <FieldWrapper style={{ borderColor: color }}>
          <LabelWrapper>
            <Label style={{ color, letterSpacing: 0.4 }}>{key}</Label>
          </LabelWrapper>

          <InputWrapper>
            <TextInput
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={(value) => this.onValueChange(value)}
              onFocus={() => this.onFocus()}
              onBlur={() => this.onBlur()}
              placeholder={placeholder}
              placeholderTextColor={color.baseMuted}
              underlineColorAndroid='transparent'
              value={value}
            />
          </InputWrapper>
          <FieldDeleteWrapper onPress={() => this.removeField(key)}>
            <Icon name='trash-bin' size={16} color={colors.baseMuted} />
          </FieldDeleteWrapper>
        </FieldWrapper>
      </View>
    )
  }
}

export class DateField extends Field {
  componentWillMount () {
    this.onValueChange(this.state.value)
  }

  render () {
    const { property, field: { key } } = this.props
    const { color } = this.state
    const value = this.state.value || property.value || new Date()

    return (
      <View ref={x => (this._root = x)}>
        <FieldWrapper style={{ borderColor: color }}>
          <LabelWrapper>
            <Label style={{ color }}>{key}</Label>
          </LabelWrapper>

          <InputWrapper>
            <DatePicker
              style={{ width: 200 }}
              date={value}
              mode='date'
              placeholder='select date'
              placeholderTextColor={color.baseMuted}
              format='YYYY-MM-DD'
              confirmBtnText='Confirm'
              cancelBtnText='Cancel'
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
              }}
              onDateChange={(date) => this.onValueChange(date)}
              onFocus={() => this.onFocus()}
              onBlur={() => this.onBlur()}
            />
          </InputWrapper>
          <FieldDeleteWrapper onPress={() => this.removeField(key)}>
            <Icon name='trash-bin' size={16} color={colors.baseMuted} />
          </FieldDeleteWrapper>
        </FieldWrapper>
      </View>
    )
  }
}

export class AddressField extends Field {
  componentWillMount () {
    this.setState({ value: {} })
    this.onValueChange(this.state.value)
  }

  render () {
    const { field, feature, onUpdate, onRemoveField } = this.props
    const { keys, strings: { placeholders } } = field

    return (
      <View ref={x => (this._root = x)}>
        {_uniq(keys).map((key) => {
          const label = key.split(':')[1]
          const placeholder = placeholders[label]
          const field = { key, label, placeholder }

          return (
            <View key={key}>
              <TextField
                field={field}
                property={{ key }}
                feature={feature}
                onRemoveField={() => {
                  onRemoveField(key)
                }}
                onUpdate={({ properties }) => {
                  onUpdate({ properties })
                  const value = Object.assign(this.state.value || {}, properties)
                  this.setState({ value })
                }}
              />
            </View>
          )
        })}
      </View>
    )
  }
}

export class ReadOnlyField extends Component {
  render () {
    const { property: { key, value } } = this.props

    return (
      <View pointerEvents='none'>
        <FieldWrapper style={{ borderColor: colors.baseMuted }}>
          <LabelWrapper>
            <Label style={{ color: colors.baseMuted }}>{key}</Label>
          </LabelWrapper>

          <InputWrapper>
            <TextInput value={value} editable={false} />
          </InputWrapper>
        </FieldWrapper>
      </View>
    )
  }
}

export class DescriptionInputField extends Component {
  render () {
    const { onValueChange, value, focus } = this.props

    return (
      <View ref={x => (this._root = x)} style={{ flex: 1 }}>
        <FieldWrapper style={{ borderColor: colors.primary }}>
          <LabelWrapper>
            <Label style={{ color: colors.primary, letterSpacing: 0.4 }}>Description</Label>
          </LabelWrapper>

          <InputWrapper>
            <TextInput
              autoFocus={focus}
              autoCapitalize='none'
              autoCorrect
              onChangeText={(value) => onValueChange(value)}
              placeholder=''
              placeholderTextColor={colors.baseMuted}
              underlineColorAndroid='transparent'
              value={value}
            />
          </InputWrapper>
        </FieldWrapper>
      </View>
    )
  }
}

export class AccessField extends Field {
  componentWillMount () {
    this.setState({ value: {} })
    this.onValueChange(this.state.value)
  }

  render () {
    const { field, feature, onUpdate, onRemoveField } = this.props
    const { keys, strings: { types, options } } = field

    const optionsArray = Object.keys(options).map((key) => {
      const option = options[key]
      return `${option.title} - ${option.description}`
    })

    return (
      <FieldGroup ref={x => (this._root = x)}>
        <LabelWrapper>
          <Label>
            Access
          </Label>
        </LabelWrapper>
        {_uniq(keys).map((key) => {
          const label = types[key]
          const field = { key, label, options: optionsArray }

          return (
            <View key={key}>
              <PickerField
                field={field}
                property={{ key }}
                feature={feature}
                onRemoveField={() => {
                  onRemoveField(key)
                }}
                onUpdate={({ properties }) => {
                  onUpdate({ properties })
                  const value = Object.assign(this.state.value || {}, properties)
                  this.setState({ value })
                }}
              />
            </View>
          )
        })}
      </FieldGroup>
    )
  }
}

export class CyclewayField extends Field {
  componentWillMount () {
    this.setState({ value: {} })
    this.onValueChange(this.state.value)
  }

  render () {
    const { field, feature, onUpdate, onRemoveField } = this.props
    const { keys, strings: { types, options } } = field

    return (
      <View ref={x => (this._root = x)}>
        {_uniq(keys).map((key) => {
          const label = types[key]
          const field = { key, label, options }

          return (
            <View key={key}>
              <PickerField
                field={field}
                property={{ key }}
                feature={feature}
                onRemoveField={() => {
                  onRemoveField(key)
                }}
                onUpdate={({ properties }) => {
                  onUpdate({ properties })
                  const value = Object.assign(this.state.value || {}, properties)
                  this.setState({ value })
                }}
              />
            </View>
          )
        })}
      </View>
    )
  }
}

export const getFieldInput = type => {
  if (!type) return TextField

  switch (type) {
    case 'access':
      return AccessField

    case 'check':
      return CheckField

    case 'combo':
      return ComboField

    case 'typeCombo':
      return ComboField

    case 'semiCombo':
      return ComboField

    case 'multiCombo':
      return ComboField

    case 'networkCombo':
      return ComboField

    case 'cycleway':
      return CyclewayField

    case 'radio':
      return ComboField

    case 'structureRadio':
      return ComboField

    case 'onewayCheck':
      return ComboField

    case 'address':
      return AddressField

    case 'localized':
      return TextField

    case 'number':
      return NumberField

    case 'maxspeed':
      return NumberField

    case 'text':
      return TextField

    case 'textarea':
      return TextField

    case 'date':
      return DateField

    default:
      throw new Error(`Unsupported field type: ${type}`)
  }
}
