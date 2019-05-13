import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import { View, Keyboard } from 'react-native'

import Container from '../../components/Container'
import Header from '../../components/Header'
import PageWrapper from '../../components/PageWrapper'

import getFeatureFields from '../../utils/get-feature-fields'
import { metaKeys } from '../../utils/uninterestingKeys'
import nextTick from '../../utils/next-tick'
import _partition from 'lodash.partition'
import orderPresets from '../../utils/order-presets'
import SaveEditDialog from '../../components/SaveEditDialog'
import { deleteFeature, uploadEdits } from '../../actions/edit'

const FieldsList = styled.SectionList`

`

const Field = styled.View`
  border-bottom-width: 1;
  border-bottom-color: #efefef;
  padding-bottom: 8;
  margin-bottom: 8;
`

const FieldKey = styled.Text`
  font-weight: 500;
  font-size: 12;
`

const FieldValue = styled.Text`
  font-weight: 300;
  font-size: 16;
  padding-top: 2;
`

const SectionHeaderField = styled.View`
  padding-top: 8;
  padding-bottom: 8;
  align-content: stretch;
`

const SectionHeader = styled.Text`
  font-weight: 400;
  font-size 20;
  padding-top: 5;
  padding-bottom: 5;
  text-transform: uppercase;
`

class ViewFeatureDetail extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Set Feature Coordinates'
    }
  }

  state = {
    dialogVisible: false
  }

  renderField (field) {
    return (
      <Field>
        <View>
          <FieldKey>{field.label || field.key}</FieldKey>
        </View>
        <View>
          <FieldValue>{field.value}</FieldValue>
        </View>
      </Field>
    )
  }

  renderFields (fields) {
    return (
      <View>
        <FieldsList
          sections={fields}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section: { title } }) => (
            <SectionHeaderField>
              <SectionHeader>{title}</SectionHeader>
            </SectionHeaderField>
          )}
          renderItem={({ item }) => this.renderField(item)}
          keyExtractor={(item, i) => `field-${i}-${item.key}`}
        />
      </View>
    )
  }

  render () {
    const { navigation, deleteFeature, uploadEdits } = this.props
    const { state: { params: { feature } } } = navigation

    const title = feature.properties.name || feature.id
    const fields = getFeatureFields(feature)
    const [ meta, presets ] = _partition(fields, field => {
      return metaKeys.indexOf(field.key) > -1
    })

    const metaSection = { 'title': 'Metadata', 'data': meta }
    const presetSection = { 'title': 'Attributes', 'data': orderPresets(presets) }

    const cancelEditDialog = () => {
      this.setState({ dialogVisible: false })
    }

    const saveEditDialog = async comment => {
      cancelEditDialog()
      Keyboard.dismiss()

      await nextTick()

      deleteFeature(feature, comment)
      uploadEdits([feature.id])
      navigation.navigate('Explore', { message: 'Your edit is being processed.', mode: 'explore' })
    }

    const headerActions = [
      {
        name: 'pencil',
        onPress: () => {
          navigation.navigate('EditFeatureDetail', { feature })
        }
      },
      {
        name: 'trash-bin',
        onPress: () => {
          this.setState({ dialogVisible: true })
        }
      }
    ]

    return (
      <Container>
        <Header back title={title} navigation={navigation} actions={headerActions} />
        <PageWrapper>
          {this.renderFields([presetSection, metaSection])}
        </PageWrapper>
        <SaveEditDialog visible={this.state.dialogVisible} cancel={cancelEditDialog} save={saveEditDialog} action='delete' />
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    edits: state.edit.edits
  }
}

const mapDispatchToProps = {
  deleteFeature,
  uploadEdits
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewFeatureDetail)
