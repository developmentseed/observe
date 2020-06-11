import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components/native'

import getTagInfo from '../utils/get-taginfo'
import formatDate from '../utils/format-date'
import { isRetryable, isConflict } from '../utils/edit-utils'
import Icon from './Collecticons'
import { colors } from '../style/variables'
import {
  EDIT_SUCCEEDED_STATUS,
  EDIT_PENDING_STATUS,
  EDIT_UPLOADING_STATUS
} from '../constants'

const ItemContainer = styled.TouchableOpacity`
  border-bottom-width: 1;
  border-bottom-color: ${colors.baseMuted};
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 5px 0px;
`

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: stretch;
`

const TextContainer = styled.View`
  flex: 1;
  margin-right: 44px;
`

const TitleText = styled.Text`
`

const SubtitleText = styled.Text`
  font-size: 12;
  color: ${colors.baseMuted};
`

const StatusContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 44;
`

class UserContributionsItem extends React.PureComponent {
  constructor (props) {
    super(props)

    // unknown height
    this.height = 50
  }

  _onPress = () => this.props.onPress && this.props.onPress(this.props.item)

  getTitle () {
    const { item } = this.props
    const feature = item.type === 'delete' ? item.oldFeature : item.newFeature
    return getTagInfo(feature) || feature.id
  }

  getErrorCode (item) {
    return item.errors.slice(-1)[0].code
  }

  getSubtitle () {
    const { isAuthorized, isConnected, item } = this.props

    switch (item.status) {
      case EDIT_SUCCEEDED_STATUS:
        return `Uploaded on ${formatDate(item.uploadTimestamp)}`
      case EDIT_UPLOADING_STATUS:
        return 'Uploading...'
      case EDIT_PENDING_STATUS:
        if (item.errors.length === 0 && !isConnected) {
          return 'Waiting for network'
        }

        if (item.errors.length === 0 && !isAuthorized) {
          return 'Waiting for authorization'
        }

        if (item.errors.length === 0) {
          return EDIT_PENDING_STATUS
        }

        if (isConflict(item)) {
          return 'Upload failed due to conflicting changes'
        }
        return `Unexpected Error: ${this.getErrorCode(item)}`
      default:
        return '' // should never happen
    }
  }

  getStatusIcon () {
    const { item } = this.props
    let iconName, color
    switch (item.status) {
      case EDIT_SUCCEEDED_STATUS:
        iconName = 'circle-tick'
        color = colors.primary
        break
      case EDIT_UPLOADING_STATUS:
        iconName = 'upload-2'
        color = colors.primary
        break
      case EDIT_PENDING_STATUS:
        if (isRetryable(item)) {
          iconName = 'clock'
          color = colors.primary
        } else {
          iconName = 'circle-xmark'
          color = '#f00'
        }
        break
    }
    return <Icon name={iconName} size={16} color={color} />
  }

  render () {
    let title = this.getTitle()
    let subtitle = this.getSubtitle()
    let statusIcon = this.getStatusIcon()
    return (
      <View
        style={{ height: this.height }}
        onLayout={({
          nativeEvent: {
            layout: { height }
          }
        }) => (this.height = height)}
      >
        <ItemContainer onPress={this._onPress}>
          <Container>
            <StatusContainer>{statusIcon}</StatusContainer>
            <TextContainer>
              <TitleText>{title}</TitleText>
              <SubtitleText>{subtitle}</SubtitleText>
            </TextContainer>
          </Container>
        </ItemContainer>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  isAuthorized: state.authorization.isAuthorized,
  isConnected: state.network.isConnected
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserContributionsItem)
