/* global test, expect */
import MapboxGL from '@mapbox/react-native-mapbox-gl'
import 'react-native'

import { createPack } from '../app/services/offline-tiles'

test('creating offline tile packs', async () => {
  await createPack({
    name: 'test1',
    bounds: [
      [
        174.7364372562418,
        -41.2591928357758
      ],
      [
        174.84188526136552,
        -41.35091629181344
      ]
    ]
  })

  const offlinePacks = await MapboxGL.offlineManager.getPacks()
  expect(offlinePacks.length).toBe(1)

  // interestingly this metadata is returned as json
  expect(offlinePacks[0].pack.metadata).toBe('{"name":"test1"}')

  await MapboxGL.offlineManager.deletePack('test1')
  const offlinePack = await MapboxGL.offlineManager.getPack('test1')
  expect(offlinePack).toBe(undefined)
})
