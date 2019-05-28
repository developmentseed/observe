import React from 'react'
import { connect } from 'react-redux'

import Header from '../../components/Header'
import Container from '../../components/Container'
import SaveEditDialog from '../../components/SaveEditDialog'
import UserContributionsList from '../../components/UserContributionsList'
import { uploadEdits, clearUploadedEdits, retryAllEdits } from '../../actions/edit'
import { getAllRetriable } from '../../utils/edit-utils'

class UserContributionsListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Your contributions'
    }
  }

  state = {
    dialogVisible: false
  }

  select = edit => {
    const { navigation } = this.props

    navigation.navigate('UserContributionsDetail', { editId: edit.id, timestamp: edit.timestamp })
  }

  cancelEditDialog = () => {
    this.setState({ dialogVisible: false })
  }

  saveEdits = async (comment) => {
    const { edits } = this.props
    const retryableEdits = getAllRetriable(edits).map(edit => edit.id)
    this.setState({ dialogVisible: false })
    console.log('calling uploadEdits', retryableEdits)
    await this.props.uploadEdits(retryableEdits, comment)
  }

  render = () => {
    const { clearUploadedEdits, navigation, edits, uploadedEdits } = this.props
    const allEdits = edits.concat(uploadedEdits).sort((a, b) => b.timestamp > a.timestamp ? 1 : -1)
    const headerActions = [
      {
        name: 'upload-2',
        onPress: () => {
          this.setState({ dialogVisible: true })
        }
      },
      {
        name: 'trash-bin',
        onPress: clearUploadedEdits
      }
    ]
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
        <SaveEditDialog visible={this.state.dialogVisible} cancel={this.cancelEditDialog} save={this.saveEdits} />

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
