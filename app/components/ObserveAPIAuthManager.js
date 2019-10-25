import { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Linking } from 'react-native'
import { setObserveAPIToken } from '../actions/observeApi'

class ObserveAPIAuthManager extends PureComponent {
  componentDidMount () {
    Linking.addEventListener('url', this.handleOpenURL)
  }

  handleOpenURL = (urlObj) => {
    const url = urlObj.url
    const { setObserveAPIToken } = this.props
    if (!url.includes('apilogin')) return
    const token = url.split('accessToken=')[1]
    setObserveAPIToken(token)
  }

  render () {
    return null
  }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = {
  setObserveAPIToken
}

export default connect(mapStateToProps, mapDispatchToProps)(ObserveAPIAuthManager)
