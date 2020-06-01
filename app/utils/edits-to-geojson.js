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

        // Add feature to editsGeojson. If feature was deleted and is pending
        // upload, add a property to flag this.
        const feature =
          e.type === 'delete'
            ? {
              ...e.oldFeature,
              properties: {
                ...e.oldFeature.properties,
                pendingDeleteUpload: true
              }
            }
            : e.newFeature

        // add this feature to the editsGeojson
        editsGeojson.features.push(addIconUrl(feature))
      }
    })
  }

  return editsGeojson
}
