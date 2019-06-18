import { Text } from 'react-native'
import React from 'react'
import styled from 'styled-components/native'

import Icon from './Collecticons'
import { colors } from '../style/variables'

const EditorWrapper = styled.View`
  background-color: #fafafa;
  border-top-width: 0.5;
  border-top-color: ${colors.muted};
  border-bottom-width: 0.5;
  border-bottom-color: ${colors.muted};
`

const ToggleButton = styled.TouchableOpacity`
  flex-direction: row;
  padding-top: 16;
  padding-right: 16;
  padding-bottom: 16;
  padding-left: 16;
`

const TagListWrapper = styled.View`
  margin-bottom: 16;
  margin-left: 16;
  margin-right: 16;
`

const TagList = styled.FlatList``

const Tag = styled.View`
  flex: 1;
  flex-direction: row;
  margin-bottom: 4;
  height: 45;
`

const TagKeyInput = styled.TextInput`
  flex: 0.45;
  padding-left: 12;
  border-width: 1;
  border-color: ${colors.muted};
  border-top-left-radius: 4;
  border-top-right-radius: 0;
  border-bottom-left-radius: 4;
  border-bottom-right-radius: 0;
  line-height: 16;
  background-color: white;
`

const TagValueInput = styled.TextInput`
  flex: 0.45;
  padding-left: 12;
  border-width: 1;
  border-color: ${colors.muted};
  border-left-width: 0;
  border-radius: 0;
  border-bottom-right-radius: 4;
  border-bottom-start-radius: 0;
  line-height: 16;
  background-color: white;
`

const TagDeleteWrapper = styled.TouchableHighlight`
  flex: 0.1;
  border-width: 1;
  border-color: ${colors.muted};
  border-left-width: 0;
  border-top-right-radius: 4;
  border-top-start-radius: 0;
  border-bottom-right-radius: 4;
  border-bottom-start-radius: 0;
  align-items: center;
  justify-content: center;
  background-color: white;
`

const AddTagWrapper = styled.TouchableOpacity`
  margin-top: 4;
  flex-direction: row;
`

export default class TagEditor extends React.Component {
  state = {
    open: false,
    properties: null
  }

  resetState () {
    this.setState({
      open: false,
      properties: [{
        key: null,
        value: null
      }]
    })
  }

  componentDidMount () {
    const { properties } = this.props

    if (!properties.length) {
      properties.push({
        key: null,
        value: null
      })
    }

    this.setState({ properties })
  }

  toggle () {
    const { open } = this.state

    if (open) {
      this.setState({ open: false })
    } else {
      this.setState({ open: true })
    }
  }

  onTogglePress () {
    this.toggle()
  }

  renderIcon () {
    const { open } = this.state

    if (open) {
      return (
        <Icon name='chevron-down' size={16} color='black' />
      )
    }

    return (
      <Icon name='chevron-right' size={16} color='black' />
    )
  }

  addTag () {
    const { properties } = this.state
    const { onUpdate } = this.props
    properties.push({ key: null, value: null })
    this.setState({ properties })
    onUpdate(properties)
  }

  removeTag (index) {
    const { properties } = this.state
    const { onUpdate } = this.props
    properties.splice(index, 1)
    this.setState({ properties })
    onUpdate(properties)
  }

  renderAddTag () {
    return (
      <AddTagWrapper onPress={() => {
        this.addTag()
      }}>
        <Icon name='plus' size={16} color='black' />
        <Text>Add tag</Text>
      </AddTagWrapper>
    )
  }

  onUpdateKey (prevKey, nextKey) {
    const { properties } = this.state
    const index = properties.findIndex((p) => p.key === prevKey)
    properties[index].key = nextKey
    this.setState({ properties })
  }

  onUpdateValue (prevValue, nextValue, key) {
    const { properties } = this.state
    const { onUpdate } = this.props
    const index = properties.findIndex((p) => p.key === key)
    properties[index].value = nextValue
    this.setState({ properties })
    onUpdate(properties)
  }

  renderTag ({ item, index }) {
    const { key, value } = item

    return (
      <Tag>
        <TagKeyInput
          autoCapitalize='none'
          onChangeText={(val) => this.onUpdateKey(key, val)}
          placeholderTextColor={colors.muted}
          placeholder='key'
          value={key}
        />
        <TagValueInput
          autoCapitalize='none'
          onChangeText={(val) => this.onUpdateValue(value, val, key)}
          placeholderTextColor={colors.muted}
          placeholder='value'
          value={value}
        />
        <TagDeleteWrapper onPress={() => this.removeTag(index)}>
          <Icon name='trash-bin' size={16} color={colors.muted} />
        </TagDeleteWrapper>
      </Tag>
    )
  }

  renderTags () {
    const { properties } = this.state

    if (!properties) return null

    return (
      <TagListWrapper>
        <TagList
          data={properties}
          keyExtractor={(item, index) => `taglist-item-${index}`}
          renderItem={(item, index) => (
            this.renderTag(item, index)
          )}
        />
        {this.renderAddTag()}
      </TagListWrapper>
    )
  }

  render () {
    const { open } = this.state

    return (
      <EditorWrapper>
        <ToggleButton onPress={() => this.onTogglePress()}>
          {this.renderIcon()}
          <Text>Additional tags</Text>
        </ToggleButton>
        {
          open && this.renderTags()
        }
      </EditorWrapper>
    )
  }
}
