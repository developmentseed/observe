import _find from 'lodash.find'
import { addIconUrl } from '../utils/add-icon-url'
import _cloneDeep from 'lodash.clonedeep'

export default function editsToGeojson (edits) {
  const editsGeojson = {
    'type': 'FeatureCollection',
    'features': []
  }
  if (edits.length) {
    edits.forEach(e => {
      if (!_find(editsGeojson.features, { 'id': e.id })) {
        // set tag information for this feature

        // Add feature to editsGeojson.
        let feature
        if (e.type === 'delete') {
          // If feature was deleted and is pending
          // upload, add a property to flag this.
          feature = _cloneDeep(e.oldFeature)
          feature.properties.pendingDeleteUpload = true
        } else if (e.type === 'modify' && e.newFeature.geometry.type !== 'Point' && e.newFeature.geometry.coordinates.length < 2) {
          // this is a special case when one of two nodes of a way is deleted, then the way itself is deleted.
          // in the edits this is considered as a modify operation because it may involve other sharedways. Read for more https://github.com/developmentseed/observe/issues/296
          feature = _cloneDeep(e.oldFeature)
          feature.properties.pendingDeleteUpload = true
        } else {
          feature = e.newFeature
        }
        // add this feature to the editsGeojson
        editsGeojson.features.push(addIconUrl(feature))
      }
    })
  }

  return editsGeojson
}
