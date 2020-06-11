import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import { Linking } from 'react-native'
import { NavigationEvents } from 'react-navigation'

import Header from '../../components/Header'
import Container from '../../components/Container'
import PageWrapper from '../../components/PageWrapper'
import Conflict from '../../components/Conflict'
import { isConflict, isRetryable, getError, getErrorExtra } from '../../utils/edit-utils'
import formatDate from '../../utils/format-date'
import {
  uploadEdits,
  clearEdit,
  setEditStatus,
  modifyEditToCreate,
  modifyEditVersion
} from '../../actions/edit'
import { getFeature } from '../../services/osm-api'
import Config from 'react-native-config'
import getTaginfo from '../../utils/get-taginfo'
import Icon from '../../components/Collecticons'
import {
  EDIT_PENDING_STATUS,
  EDIT_SUCCEEDED_STATUS,
  EDIT_UPLOADING_STATUS
} from '../../constants'

const Text = styled.Text``
const ChangesetText = styled.Text`
  font-weight: 500;
  font-size: 18;
`

const FeatureInfoText = styled.Text`
  font-weight: 300;
  font-size: 14;
  padding-top: 10;
`

const UploadStatusText = styled.Text`
`

const ErrorText = styled.Text`
  font-family: monospace;
  padding-top: 10;
  padding-bottom: 10;
`

const UploadStatusView = styled.View`
  flex: 1;
`

const StatusIcon = styled.Text`
  padding-top: 10;
  padding-bottom: 10;
`
class UserContributionsItemScreen extends React.Component {
  state = {
    conflictLoading: true,
    conflictFeature: null,
    conflictError: null
  }

  fetchConflictFeature () {
    const edit = this.getEdit()
    this.setState({ conflictLoading: true })
    const [featureType, featureId] = edit.id.split('/')
    getFeature(featureType, featureId)
      .then(featureCollection => {
        this.setState({ conflictFeature: featureCollection.features[0], conflictLoading: false })
      })
      .catch(err => {
        // If FeatureDeletedError, dont treat as an error, set conflictFeature to an object saying { isDeleted: true }
        this.setState({
          conflictError: err.code === 'FeatureDeletedError' ? null : err,
          conflictLoading: false,
          conflictFeature: err.code === 'FeatureDeletedError' ? { isDeleted: true } : null
        })
      })
  }

  onFocus () {
    const edit = this.getEdit()
    if (edit.status === EDIT_PENDING_STATUS && isConflict(edit)) {
      this.fetchConflictFeature()
    }
  }

  onBlur () {
    // reset state on blur
    this.setState({
      conflictLoading: true,
      conflictFeature: null,
      conflictError: null
    })
  }

  navigateToChangeset = () => {
    const edit = this.getEdit()
    const url = `${Config.API_URL}/changeset/${edit.changesetId}`
    Linking.openURL(url)
      .catch(err => {
        console.error('Failed to open URL', err)
      })
  }

  updateConflict = () => {
    const edit = this.getEdit()
    const { conflictLoading, conflictError, conflictFeature } = this.state
    if (conflictLoading || conflictError) {
      return console.log('still loading or has errors')
    }

    // upstream feature has been deleted, create a new feature edit instead
    if (conflictFeature.isDeleted) {
      // Upstream is deleted and user action is delete
      // We discard the edit
      if (edit.type === 'delete') {
        return this.discardEdit()
      }
      this.props.modifyEditToCreate(edit.id)
    } else {
      // upstream feature not deleted - over-ride edits by incrementing current edit version number
      this.props.modifyEditVersion(edit.id, conflictFeature.properties.version)
    }
    this.props.uploadEdits([edit.id])
    this.props.navigation.navigate('UserContributions')
  }

  discardEdit = () => {
    const edit = this.getEdit()
    this.props.clearEdit(edit)
    this.props.navigation.navigate('UserContributions')
  }

  retryUpload = () => {
    const edit = this.getEdit()
    this.props.uploadEdits([edit.id])
    this.props.navigation.navigate('UserContributions')
  }

  forceRetryUpload = () => {
    const edit = this.getEdit()
    const { navigation } = this.props
    this.props.setEditStatus(edit.id, EDIT_PENDING_STATUS)
    this.props.uploadEdits([edit.id])
    navigation.navigate('UserContributions')
  }

  getUploadedActions () {
    return [
      {
        name: 'magnifier-right',
        onPress: this.navigateToChangeset
      },
      {
        name: 'trash-bin',
        onPress: this.discardEdit
      }
    ]
  }

  getUploadingActions () {
    return [
      {
        name: 'upload-2',
        onPress: this.forceRetryUpload
      },
      {
        name: 'trash-bin',
        onPress: this.discardEdit
      }
    ]
  }

  getConflictActions () {
    return [
      {
        name: 'hand-thumbs-up',
        onPress: this.updateConflict
      },
      {
        name: 'hand-thumbs-down',
        onPress: this.discardEdit
      }
    ]
  }

  getPendingActions () {
    return [
      {
        name: 'upload-2',
        onPress: this.retryUpload
      },
      {
        name: 'trash-bin',
        onPress: this.discardEdit
      }
    ]
  }

  getWayConflictActions () {
    return [
      {
        name: 'trash-bin',
        onPress: this.discardEdit
      }
    ]
  }

  getHeaderActions (edit) {
    if (edit.status === EDIT_SUCCEEDED_STATUS) {
      return this.getUploadedActions()
    }
    if (edit.status === EDIT_PENDING_STATUS && isConflict(edit)) {
      return this.getConflictActions()
    }
    if (edit.status === EDIT_UPLOADING_STATUS) {
      return this.getUploadingActions()
    }
    return this.getPendingActions()
  }

  getUploadedPage (edit) {
    const feature = edit.type === 'delete' ? edit.oldFeature : edit.newFeature

    return (
      <PageWrapper>
        <ChangesetText>
          {`Changeset ${edit.changesetId}`}
        </ChangesetText>
        <Text>
          {`Your changeset was successfully uploaded on ${formatDate(edit.uploadTimestamp)}`}
        </Text>
        <FeatureInfoText>
          { getTaginfo(feature) }
        </FeatureInfoText>
      </PageWrapper>
    )
  }

  getUploadStatus (edit) {
    const { isAuthorized, isConnected } = this.props

    const error = getError(edit)
    const retryable = isRetryable(edit)

    switch (true) {
      case edit.errors.length === 0 && !isConnected: {
        return (
          <UploadStatusView>
            <StatusIcon>
              <Icon name='circle-information' size={30} color='blue' />
            </StatusIcon>
            <UploadStatusText>
              This changeset has not been uploaded yet. It will be uploaded
              next time you connect to a network.
            </UploadStatusText>
          </UploadStatusView>
        )
      }

      case edit.errors.length === 0 && !isAuthorized: {
        return (
          <UploadStatusView>
            <StatusIcon>
              <Icon name='circle-information' size={30} color='blue' />
            </StatusIcon>
            <UploadStatusText>
              This changeset has not been uploaded yet. It will be uploaded
              once you log in.
            </UploadStatusText>
          </UploadStatusView>
        )
      }

      case edit.errors.length === 0: {
        return (
          <UploadStatusView>
            <StatusIcon>
              <Icon name='circle-information' size={30} color='blue' />
            </StatusIcon>
            <UploadStatusText>
              This changeset has not been uploaded yet. Tap the upload button
              above to retry.
            </UploadStatusText>
          </UploadStatusView>
        )
      }

      case retryable: {
        return (
          <UploadStatusView>
            <StatusIcon>
              <Icon name='circle-information' size={30} color='blue' />
            </StatusIcon>
            <UploadStatusText>
              This changeset has not been uploaded yet, but you can retry.
              The error message during the last attempt is:
            </UploadStatusText>
            <ErrorText>
              {error.message}
            </ErrorText>
          </UploadStatusView>
        )
      }

      default: {
        const errorExtra = getErrorExtra(edit)
        const extraString = typeof (errorExtra) === 'string' ? errorExtra : JSON.stringify(errorExtra, null, 2)
        return (
          <UploadStatusView>
            <StatusIcon>
              <Icon name='circle-xmark' size={30} color='red' />
            </StatusIcon>
            <UploadStatusText>
              This changeset failed to upload, and cannot be retried. The
              error message is:
            </UploadStatusText>
            <ErrorText>
              {error.message}
            </ErrorText>
            <UploadStatusText>
              Extra debug information:
            </UploadStatusText>
            <ErrorText selectable>
              {extraString}
            </ErrorText>
          </UploadStatusView>
        )
      }
    }
  }

  getPendingPage (edit) {
    const feature = edit.type === 'delete' ? edit.oldFeature : edit.newFeature

    return (
      <PageWrapper>
        <ChangesetText>
          { getTaginfo(feature)}
        </ChangesetText>
        <Text>{`${formatDate(edit.uploadTimestamp)}`}</Text>
        {this.getUploadStatus(edit)}
      </PageWrapper>
    )
  }

  getConflictPage () {
    const edit = this.getEdit()

    if (this.state.conflictLoading) {
      return (
        <PageWrapper>
          <Text>Loading upstream feature...</Text>
        </PageWrapper>
      )
    }
    if (this.state.conflictError) {
      return (
        <PageWrapper>
          <Text>
            Error loading upstream feature
          </Text>
        </PageWrapper>
      )
    }
    // console.log('conflict', edit, this.state.conflictFeature)
    return (
      <Conflict
        originalEdit={edit}
        updatedFeature={this.state.conflictFeature}
      />
    )
  }

  getUploadingPage () {
    return (
      <PageWrapper>
        <Text>
          Edit is being uploaded, please wait...
        </Text>
        <Text>
          If this upload seems stuck, you can try forcing a re-upload or discarding it.
        </Text>
      </PageWrapper>
    )
  }

  getPage (edit) {
    switch (edit.status) {
      case EDIT_SUCCEEDED_STATUS:
        return this.getUploadedPage(edit)

      case EDIT_UPLOADING_STATUS:
        return this.getUploadingPage()

      case EDIT_PENDING_STATUS:
      default:
        if (isConflict(edit)) {
          return this.getConflictPage(edit)
        }

        return this.getPendingPage(edit)
    }
  }

  getEdit () {
    const { edits, uploadedEdits } = this.props
    const editId = this.props.navigation.getParam('editId')
    const timestamp = this.props.navigation.getParam('timestamp')
    const allEdits = edits.concat(uploadedEdits)
    return allEdits.find(e => e.id === editId && e.timestamp === timestamp)
  }

  render () {
    const { navigation } = this.props
    let edit = this.getEdit()

    if (!edit) return null
    const headerActions = this.getHeaderActions(edit)
    const page = this.getPage(edit)
    return (
      <Container>
        <NavigationEvents
          onDidFocus={(payload) => this.onFocus(payload)}
          onDidBlur={() => this.onBlur()}
        />
        <Header
          back
          actions={headerActions}
          navigation={navigation}
          title='Upload Details'
        />
        { page }
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  isAuthorized: state.authorization.isAuthorized,
  isConnected: state.network.isConnected,
  edits: state.edit.edits,
  uploadedEdits: state.edit.uploadedEdits
})

const mapDispatchToProps = {
  uploadEdits,
  clearEdit,
  setEditStatus,
  modifyEditVersion,
  modifyEditToCreate
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserContributionsItemScreen)
