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
  const nodeIds = nodes.map(n => {
    return `node/${n.id}`
  })

  await AsyncStorage.multiSet(items)
  await AsyncStorage.setItem(tile, nodeIds)
}

export async function getNodes (nodeIds) {
  const nodes = await AsyncStorage.multiGet(nodeIds)
  return nodes.reduce((memo, val) => {
    memo[val[0]] = JSON.parse(val[1])
    return memo
  }, {})
}

export async function getNodesForTile (tile) {
  const nodeIds = await AsyncStorage.getItem(tile)
  return nodeIds
}
