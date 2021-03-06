import React from 'react'
import { connect } from 'react-redux'

import Header from '../../components/Header'
import Container from '../../components/Container'

import UserContributionsList from '../../components/UserContributionsList'
import { uploadEdits, clearUploadedEdits, retryAllEdits } from '../../actions/edit'

class UserContributionsListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Your contributions'
    }
  }

  select = edit => {
    const { navigation } = this.props

    navigation.navigate('UserContributionsDetail', { editId: edit.id, timestamp: edit.timestamp })
  }

  render () {
    const { navigation, edits, uploadedEdits } = this.props
    const allEdits = edits.concat(uploadedEdits).sort((a, b) => b.timestamp > a.timestamp ? 1 : -1)
    let headerActions
    if (allEdits && allEdits.length) {
      headerActions = [
        {
          name: 'upload-2',
          onPress: this.props.retryAllEdits
        },
        {
          name: 'trash-bin',
          onPress: this.props.clearUploadedEdits
        }
      ]
    }
    return (
      <Container>
        <Header
          navigation={navigation}
          actions={headerActions}
        />
        <UserContributionsList
          data={allEdits}
          onSelectItem={this.select}
        />

      </Container>
    )
  }
}

const mapStateToProps = state => ({
  edits: state.edit.edits,
  uploadedEdits: state.edit.uploadedEdits
})

const mapDispatchToProps = {
  uploadEdits,
  clearUploadedEdits,
  retryAllEdits
}

export default connect(mapStateToProps, mapDispatchToProps)(UserContributionsListScreen)
