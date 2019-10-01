import _find from 'lodash.find'
import { addIconUrl } from '../utils/add-icon-url'

export default function editsToGeojson (edits) {
  const editsGeojson = {
    'type': 'FeatureCollection',
    'features': []
  }
  if (edits.length) {
    edits.forEach(e => {
      if (!_find(editsGeojson.features, { 'id': e.id })) {
        // set tag information for this feature
        const feature = e.type === 'delete' ? e.oldFeature : e.newFeature
        // add this feature to the editsGeojson
        editsGeojson.features.push(addIconUrl(feature))
      }
    })
  }

  return editsGeojson
}
