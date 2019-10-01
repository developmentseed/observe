import { PureComponent } from 'react'
import { connect } from 'react-redux'

import { setAuthorized } from '../actions/authorization'
import { isAuthorized as checkAuthorization } from '../services/auth'

class AuthorizationManager extends PureComponent {
  async componentDidMount () {
    this.props.setAuthorized(await checkAuthorization())
  }

  async componentDidUpdate ({ isAuthorized: wasAuthorized }) {
    const isAuthorized = await checkAuthorization()

    if (wasAuthorized !== isAuthorized) {
      this.props.setAuthorized(isAuthorized)
    }
  }

  render () {
    return null
  }
}

const mapStateToProps = state => ({
  isAuthorized: state.authorization.isAuthorized,
  // subscribe to all state changes
  state
})

const mapDispatchToProps = {
  setAuthorized
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorizationManager)
