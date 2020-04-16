import AsyncStorage from '@react-native-community/async-storage'

/**
 *
 * @param {Array<Object>} nodes - array of node objects with lat, lng and id
 * @param {String} tile - tile these nodes fall in
 */
export async function addNodes (tile, nodes) {
  const items = nodes.map(n => [
    `node/${n.id}`,
    JSON.stringify({
      'lat': n.lat,
      'lon': n.lon
    })
  ])
  const nodeIds = nodes.map(n => {
    return `node/${n.id}`
  })

  await AsyncStorage.multiSet(items)
  await AsyncStorage.setItem(tile, JSON.stringify(nodeIds))
}

/**
 * Returns node geometry for an array of node ids
 * @param {Array<Object>} nodeIds - array of node ids
 * @return {<Object>}
 */
export async function getNodes (nodeIds) {
  const nodes = await AsyncStorage.multiGet(nodeIds)
  return nodes.reduce((memo, val) => {
    memo[val[0]] = JSON.parse(val[1])
    return memo
  }, {})
}

/**
 * Get node ids for a tile
 * @param {string} tile - tile id
 * @return {<Object>}
 */
export async function getNodesForTile (tile) {
  const nodeIds = await AsyncStorage.getItem(tile)
  return JSON.parse(nodeIds)
}

/**
 * Get node geometries for an array of tile ids
 * @param {Array<Object>} tiles
 * @return {<Object>}
 */
export async function getNodesForTiles (tiles) {
  const nodeIds = await AsyncStorage.multiGet(tiles)
  return nodeIds.reduce(async (memo, val) => {
    const newMemo = await Promise.resolve(memo)
    newMemo[val[0]] = await getNodes(JSON.parse(val[1]))
    return Promise.resolve({ ...newMemo })
  }, Promise.resolve({}))
}

/**
 * Clear the async storage cache entirely
 */
export async function purgeCache () {
  try {
    await AsyncStorage.clear()
  } catch (error) {
    console.error('Failed to purge async storage cache')
  }
}

/**
 * Remove nodes of a tile from the cache
 * @param {string} tile - tile id
 */
export async function clearCacheForTile (tile) {
  const keys = await getNodesForTile(tile)
  try {
    await AsyncStorage.multiRemove(keys)
    await AsyncStorage.removeItem(tile)
  } catch (error) {
    console.error('Failed to remove node', error)
  }
}
