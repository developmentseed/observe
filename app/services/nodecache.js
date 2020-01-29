import AsyncStorage from '@react-native-community/async-storage'

/**
 *
 * @param {Array<Object>} nodes - array of node objects with lat, lng and id
 * @param {String} tile - tile these nodes fall in
 */
export async function addNodes (tile, nodes) {
  console.log('nodes to set', nodes)
  const items = nodes.map(n => [
    `node/${n.id}`,
    JSON.stringify({
      lat: n.lat,
      lng: n.lng
    })
  ])
  // console.log('node ids', nodes.map(n => n.id))
  const nodesInTile = nodes.map(n => [
    tile,
    `node/${n.id}`
  ])
  await AsyncStorage.multiSet(items)
  await AsyncStorage.multiSet(nodesInTile)
}

export async function getNodes (nodeIds) {
  const nodes = await AsyncStorage.multiGet(nodeIds)
  return nodes.reduce((memo, val) => {
    memo[val[0]] = JSON.parse(val[1])
    return memo
  }, {})
}
