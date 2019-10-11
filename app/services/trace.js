import * as types from '../actions/actionTypes'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'

async function startTrace (dispatch) {
  dispatch({
    type: types.STARTED_TRACE
  })
  let { status } = await Permissions.askAsync(Permissions.LOCATION)
  if (status !== 'granted') {
    // TODO: show error message
  }
  const watcher = await Location.watchPositionAsync({
    accuracy: Location.Accuracy.BestForNavigation,
    timeInterval: 1000, // TODO: get from config
    distanceInterval: 5 // TODO: get from config
  }, location => {
    dispatch({
      type: types.TRACE_POINT_CAPTURED,
      data: location
    })
  })
  dispatch({
    type: types.SET_TRACE_SUBSCRIPTION,
    data: watcher
  })
}

async function endTrace (dispatch, watcher) {
  if (watcher) watcher.remove()
  dispatch({
    type: types.ENDED_TRACE
  })
}

export default {
  startTrace,
  endTrace
}
