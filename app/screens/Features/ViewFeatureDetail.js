import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import { View, Keyboard } from 'react-native'

import Container from '../../components/Container'
import Header from '../../components/Header'
import PageWrapper from '../../components/PageWrapper'
import FeatureDetailHeader from '../../components/FeatureDetailHeader'

import getFeatureFields from '../../utils/get-feature-fields'
import { metaKeys } from '../../utils/uninterestingKeys'
import nextTick from '../../utils/next-tick'
import _partition from 'lodash.partition'
import orderPresets from '../../utils/order-presets'
import SaveEditDialog from '../../components/SaveEditDialog'
import { deleteFeature, uploadEdits } from '../../actions/edit'
import { colors } from '../../style/variables'
import PhotoGrid from '../../components/PhotoGrid'
import { getPhotosForFeature } from '../../utils/photos'
import { modes } from '../../utils/map-modes'

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
  padding-top: 2;
`

const SectionHeaderField = styled.View`
  padding-top: 8;
  padding-bottom: 8;
  align-content: stretch;
`
// TODO: Text transform is not rendering correctly in React Native 0.58 - upgrade to 0.59 to use text-transform property
const SectionHeader = styled.Text`
  font-weight: 400;
  padding-top: 5;
  padding-bottom: 5;
  color: ${colors.primary};
  /* text-transform: uppercase; */
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

  isFeatureInRelation () {
    const { featuresInRelation, navigation } = this.props
    const { state: { params: { feature } } } = navigation
console.log('feature', feature, featuresInRelation.includes(feature.id))
    return featuresInRelation.includes(feature.id)
  }

  render () {
    const { navigation, photos } = this.props
    const { state: { params: { feature } } } = navigation
    const { preset } = this.state
    const featurePhotos = getPhotosForFeature(photos, feature.id)
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

      this.props.deleteFeature(feature, comment)
      this.props.uploadEdits([feature.id])
      navigation.navigate('Explore', { message: 'Your edit is being processed.', mode: modes.EXPLORE })
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
          if (this.isFeatureInRelation()) {
            console.log('delete not allowed')
            return
          }

          this.setState({ dialogVisible: true })
        }
      }
    ]

    return (
      <Container>
        <Header back title={title} navigation={navigation} actions={headerActions} />
        <FeatureDetailHeader
          preset={preset}
          feature={feature}
          navigation={navigation}
          featureInRelation={this.isFeatureInRelation()}
        />
        <PageWrapper>
          {this.renderFields([presetSection, metaSection])}
        </PageWrapper>
        <PhotoGrid
          data={featurePhotos}
          previousScreen='ViewFeatureDetail'
          feature={feature}
          navigation={navigation}
        />
        <SaveEditDialog visible={this.state.dialogVisible} cancel={cancelEditDialog} save={saveEditDialog} action='delete' />
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    edits: state.edit.edits,
    photos: state.photos.photos,
    featuresInRelation: state.map.featuresInRelation
  }
}

const mapDispatchToProps = {
  deleteFeature,
  uploadEdits
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewFeatureDetail)
