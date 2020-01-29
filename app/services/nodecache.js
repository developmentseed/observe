import AsyncStorage from '@react-native-community/async-storage'

/**
 * 
 * @param {Array<Object>} nodes - array of node objects with lat, lng and id 
 */
export async function addNodes(nodes) {
  const items = nodes.map(n => [
    n.id,
    {
      lat: n.lat,
      lng: n.lng
    }
  ])
  return await AsyncStorage.multiSet(items)
}

export async function getNodes(nodeIds) {
  return await AsyncStorage.multiGet(nodeIds)
}