import React from 'react'
import styled from 'styled-components/native'
import turfBooleanEqual from '@turf/boolean-equal'
import _difference from 'lodash.difference'

import PageWrapper from './PageWrapper'
import propertiesDiff from '../utils/properties-diff'
import Icon from './Collecticons'
import formatDate from '../utils/format-date'

const Text = styled.Text``
const View = styled.View``
const GeometryChangeText = styled.Text`
  padding-top: 10;
`
const RedText = styled.Text`
  color: red
`
const HelpText = styled.Text`
  padding-bottom: 10;
`

const Field = styled.View`
  border-bottom-width: 1;
  border-bottom-color: #efefef;
  padding-bottom: 8;
  margin-bottom: 8;
`

const FieldKey = styled.Text`
  font-weight: 500;
  font-size: 16;
`

const FieldValue = styled.Text`
  font-weight: 300;
  font-size: 14;
  padding-top: 2;
`
const FieldNewValue = styled.Text`
  font-weight: 300;
  font-size: 14;
  padding-top: 2;
  color: red;
`
const List = styled.FlatList`
  padding-top: 10;
`

export default class Conflict extends React.Component {
  bothDeleted () {
    return (
      <PageWrapper>
        <Text>
          This feature was already deleted on the server.
          Nothing to do. You can go back or discard this change.
        </Text>
      </PageWrapper>
    )
  }

  upstreamDeleted () {
    const { originalEdit } = this.props
    const originalFeature = originalEdit.oldFeature
    const diff = propertiesDiff(originalFeature.properties, {})
    return (
      <PageWrapper>
        <Text>
          The feature you were modifying has been deleted.
          Do you want to create a new feature with your changes or discard your edit?
        </Text>
        {this.renderDiffList(originalFeature, undefined, diff)}
        <HelpText>
          <Icon name='hand-thumbs-up' size={12} > to create a new feature</Icon>
        </HelpText>
        <HelpText>
          <Icon name='hand-thumbs-down' size={12} > to discard your edit</Icon>
        </HelpText>
      </PageWrapper>
    )
  }

  featureDeleted () {
    const { originalEdit, updatedFeature } = this.props
    const originalFeature = originalEdit.oldFeature
    const diff = propertiesDiff(originalFeature.properties, updatedFeature.properties)
    return (
      <PageWrapper>
        <Text>
          There were changes made to this feature since you deleted it.
          Do you still want to delete the feature, or discard your change?
        </Text>
        {this.renderDiffList(originalFeature, updatedFeature, diff)}
        <HelpText>
          <Icon name='hand-thumbs-up' size={12} > to delete the feature</Icon>
        </HelpText>
        <HelpText>
          <Icon name='hand-thumbs-down' size={12} > to discard your edit</Icon>
        </HelpText>
      </PageWrapper>
    )
  }

  featureIsAWay () {
    return (
      <PageWrapper>
        <Text>
          Overwriting a conflicting line or area is not currently supported. Discard this edit and fetch latest data.
        </Text>
      </PageWrapper>
    )
  }

  renderDiff (prop) {
    let Fields
    if (prop.newValue) {
      Fields = (
        <View>
          <FieldValue>{prop.oldValue || '(empty)' }</FieldValue>
          <FieldNewValue>{prop.newValue}</FieldNewValue>
        </View>
      )
    } else {
      Fields = (
        <View>
          <FieldValue>{prop.oldValue}</FieldValue>
        </View>
      )
    }
    return (
      <Field>
        <View>
          <FieldKey>{prop.key}</FieldKey>
        </View>
        {Fields}
      </Field>
    )
  }

  renderDiffList (originalFeature, updatedFeature, diff) {
    const tags = Object.keys(diff)
    const data = []
    tags.forEach(tag => {
      const typeOfConflict = Object.keys(diff[tag])
      let oldValue = originalFeature.properties[tag]
      let newValue
      if (typeOfConflict[0] !== 'unchanged') {
        newValue = typeOfConflict.indexOf('modifiedNew') > -1 ? diff[tag]['modifiedNew'] : diff[tag][typeOfConflict[0]]
      }
      data.push({
        'key': tag,
        'newValue': newValue,
        'oldValue': oldValue
      })
    })

    if (updatedFeature && !updatedFeature.isDeleted) {
      data.push({
        'key': 'user',
        'newValue': updatedFeature.properties.user,
        'oldValue': originalFeature.properties.user
      })
      data.push({
        'key': 'timestamp',
        'newValue': `${formatDate(updatedFeature.properties.timestamp)}`,
        'oldValue': `${formatDate(originalFeature.properties.timestamp)}`
      })
    }

    return (
      <List
        data={data}
        renderItem={({ item }) => this.renderDiff(item)}
      />
    )
  }

  featureModified () {
    const { originalEdit, updatedFeature } = this.props
    const originalFeature = originalEdit.newFeature
    const diff = propertiesDiff(originalFeature.properties, updatedFeature.properties)

    let geometryChanged = false
    let geometryChangedMessage
    if (originalFeature.geometry.type === 'Point') {
      geometryChanged = !turfBooleanEqual(originalFeature, updatedFeature)
    } else {
      const originalNodes = originalFeature.properties.ndrefs
      const updatedNodes = updatedFeature.properties.ndrefs
      geometryChanged = _difference(originalNodes, updatedNodes).length > 0
    }
    if (geometryChanged) {
      geometryChangedMessage = (
        <GeometryChangeText>The geometry has changed. For ways, this means that node references have changed.</GeometryChangeText>
      )
    } else {
      geometryChangedMessage = (
        <GeometryChangeText>No change in geometry. For ways, this means that node references have not changed.</GeometryChangeText>
      )
    }
    return (
      <PageWrapper>
        <Text>
          This feature has been modified since you edited it.
        </Text>
        <Text>
          Do you want to over-write? New changes to the feature are shown in
          <RedText> red.</RedText>
        </Text>
        {geometryChangedMessage}
        {this.renderDiffList(originalEdit.newFeature, updatedFeature, diff)}
        <HelpText>
          <Icon name='hand-thumbs-up' size={12} > to over-write with your edit</Icon>
        </HelpText>
        <HelpText>
          <Icon name='hand-thumbs-down' size={12} > to discard your edit</Icon>
        </HelpText>
      </PageWrapper>
    )
  }

  render () {
    const { originalEdit, updatedFeature } = this.props

    if (updatedFeature.isDeleted && originalEdit.type === 'delete') {
      return this.bothDeleted()
    }
    if (updatedFeature.isDeleted) {
      return this.upstreamDeleted()
    }
    if (originalEdit.newFeature.wayEditingHistory) {
      return this.featureIsAWay()
    }
    if (originalEdit.type === 'delete') {
      return this.featureDeleted()
    }
    return this.featureModified()
  }
}
