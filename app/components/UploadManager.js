import { PureComponent } from 'react'
import { connect } from 'react-redux'

import { retryAllEdits } from '../actions/edit'

class UploadManager extends PureComponent {
  componentDidUpdate ({
    isAuthorized: wasAuthorized,
    isConnected: wasConnected
  }) {
    const { isConnected, isAuthorized } = this.props

    if (
      (!wasConnected && isConnected && isAuthorized) ||
      (!wasAuthorized && isAuthorized && isConnected)
    ) {
      this.props.retryAllEdits()
    }
  }

  render () {
    return null
  }
}

const mapStateToProps = state => ({
  isAuthorized: state.authorization.isAuthorized,
  isConnected: state.network.isConnected
})

const mapDispatchToProps = {
  retryAllEdits
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadManager)
