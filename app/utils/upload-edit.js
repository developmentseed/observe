import getChangesetXML from './get-changeset-xml'
import editToOSMChange from './edit-to-osm-change'
import {
  createChangeset,
  uploadOsmChange,
  closeChangeset,
  getMemberNodes
} from '../services/api'

import { version } from '../../package.json'
/**
 * Takes a single edit object and creates a changeset for it and uploads it to the OSM API
 * @param {Object} edit - edit object with `id`, `oldFeature`, `newFeature`, `type`
 * @param {Object} changesetTags - key value pairs to add as changeset tags
 */
export default async function uploadEdit (edit) {
  const changesetTags = {
    created_by: `Observe-${version}`,
    comment: edit.comment
  }
  let memberNodes = null
  let [featureType, featureId] = edit.id.split('/')

  if (edit.type === 'delete' && featureType === 'way') {
    memberNodes = await getMemberNodes(featureId, edit.oldFeature.properties.version)
  }
  const changesetXML = getChangesetXML(changesetTags)
  let changesetId
  changesetId = await createChangeset(changesetXML)
  console.log('changeset ID', changesetId)
  const osmChangeXML = editToOSMChange(edit, changesetId, memberNodes)
  console.log('osm change xml', osmChangeXML)
  await uploadOsmChange(osmChangeXML, changesetId)
  console.log('osm change uploaded')
  await closeChangeset(changesetId)
  console.log('changeset closed')
  return changesetId
}
