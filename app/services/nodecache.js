import AsyncStorage from '@react-native-community/async-storage'

/**
 * 
 * @param {Array<Object>} nodes - array of node objects with lat, lng and id 
 */
export async function addNodes(nodes) {
  const items = nodes.map(n => [
    `node/${n.id}`,
    JSON.stringify({
      lat: n.lat,
      lng: n.lng
    })
  ])
   // console.log('node ids', nodes.map(n => n.id))
  return await AsyncStorage.multiSet(items)
}

export async function getNodes(nodeIds) {
  const nodes = await AsyncStorage.multiGet(nodeIds)
  return nodes.reduce((memo, val) => {
    memo[val[0]] = JSON.parse(val[1])
    return memo
  }, {})
}