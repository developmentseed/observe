/* global fetch */
/* global test */
/* global __dirname */
/* global expect */

import {
  addNodes,
  getNodes,
  getNodesForTile
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
