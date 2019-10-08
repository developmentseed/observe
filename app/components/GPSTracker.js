import { Component } from 'react'
import { connect } from 'react-redux'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'

class GPSTracker extends Component {


  componentDidMount () {
    this.startWatching()
  }

  startWatching = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== 'granted') {
      // TODO: show error message
    }
    await Location.watchPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 1000,
      distanceInterval: 5
    }, location => {
      console.log('location', location)
    })
  }

  render () {
    return null
  }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GPSTracker)
