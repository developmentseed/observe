/* global fetch */
/* global test */
/* global __dirname */
/* global expect */

import {
  addNodes,
  getNodes,
  getNodesForTile,
  getNodesForTiles,
  clearNodeCacheForTile,
  purgeNodeCache
} from '../../app/services/nodecache'

import nodes from '../fixtures/nodes.json'

test('add and get nodes from the cache', async () => {
  // load fixture
  const tile = '0320100322313212'
  await addNodes(tile, nodes)

  const nodeIds = nodes.map(n => [ `node/${n.id}` ])
  const nodesFromCache = await getNodes(nodeIds)
  expect(nodesFromCache).toMatchSnapshot()
})

test('get nodes for a tile', async () => {
  const tile = '0320100322313212'
  await addNodes(tile, nodes)

  const nodeIds = await getNodesForTile(tile)
  expect(nodeIds).toMatchSnapshot()
})

test('get nodes for an array of tiles', async () => {
  const tiles = ['0320100322313212', '0320100322313213']
  await addNodes(tiles[0], nodes)
  await addNodes(tiles[1], nodes)

  const tileNodes = await getNodesForTiles(tiles)
  expect(tileNodes).toMatchSnapshot()
})

test('remove nodes for a tile', async () => {
  await purgeNodeCache()

  const tile = '0320100322313212'
  const nodeIds = [ 'node/8548730',
    'node/8548853',
    'node/8548854',
    'node/8548856',
    'node/8548857',
    'node/8548858',
    'node/8548859' ]
  await addNodes(tile, nodes)

  await clearNodeCacheForTile(tile)
  const dataForRemovedTile = await getNodesForTile(tile)

  const nodesFromCache = await getNodes(nodeIds)
  expect(dataForRemovedTile).toMatchSnapshot()
  expect(nodesFromCache).toMatchSnapshot()
})
