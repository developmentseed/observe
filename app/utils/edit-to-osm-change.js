import { DOMParser } from 'xmldom'
import _omit from 'lodash.omit'
import { nonpropKeys } from '../utils/uninterestingKeys'

/**
 * Takes an edit and transforms it into `osmChange` XML to be uploaded to the OSM API
 * @param {Object} edit - an "edit" item, containing `type`, `oldFeature` and `newFeature`
 * @param {Number} changesetId - changeset id
 * @param {FeatureCollection} memberNodes - feature collection of member nodes (needed when deleting a way)
 * @return {String<XML>} - osmChange XML string
 */
export default function (edit, changesetId, memberNodes = null) {
  const xmlRoot = '<osmChange></osmChange>'
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlRoot, 'text/xml')
  const changeTypeNode = xmlDoc.createElement(edit.type)
  if (edit.type === 'delete') {
    changeTypeNode.setAttribute('if-unused', 'true')
  }
  const rootElem = xmlDoc.getElementsByTagName('osmChange')
  const feature = edit.type === 'delete' ? edit.oldFeature : edit.newFeature
  let [ featureType, id ] = feature.id.split('/')

  // for newly created elements, always set id to `-1`
  if (edit.type === 'create') {
    id = '-1'
  }

  const changeNode = xmlDoc.createElement(featureType)
  changeNode.setAttribute('id', id)
  changeNode.setAttribute('changeset', changesetId)
  changeNode.setAttribute('version', feature.properties.version)
  if (featureType === 'node') {
    changeNode.setAttribute('lon', feature.geometry.coordinates[0])
    changeNode.setAttribute('lat', feature.geometry.coordinates[1])
  }
  const tags = getTags(feature)
  Object.keys(tags).forEach(k => {
    const tagElem = xmlDoc.createElement('tag')
    tagElem.setAttribute('k', k)
    tagElem.setAttribute('v', tags[k])
    changeNode.appendChild(tagElem)
  })
  if (featureType === 'way') {
    const refs = feature.properties.ndrefs
    refs.forEach(ref => {
      const refElem = xmlDoc.createElement('nd')
      refElem.setAttribute('ref', ref)
      changeNode.appendChild(refElem)
    })
  }
  changeTypeNode.appendChild(changeNode)

  // If it is a way being deleted, add deletes for all orphaned member nodes
  if (edit.type === 'delete' && featureType === 'way') {
    if (!memberNodes) {
      throw new Error('deleting a way, but no member nodes supplied')
    }
    memberNodes.features.forEach(feature => {
      const osmProps = _omit(feature.properties, nonpropKeys)

      // Only delete the node if it doesn't have any osm tags
      if (Object.keys(osmProps).length === 0) {
        const nodeElem = xmlDoc.createElement('node')
        nodeElem.setAttribute('id', feature.properties.id.split('/')[1])
        nodeElem.setAttribute('lon', feature.geometry.coordinates[0])
        nodeElem.setAttribute('lat', feature.geometry.coordinates[1])
        nodeElem.setAttribute('version', feature.properties.version)
        nodeElem.setAttribute('changeset', changesetId)
        changeTypeNode.appendChild(nodeElem)
      }
    })
  }
  rootElem[0].appendChild(changeTypeNode)
  return xmlDoc.toString()
}

/**
 * @param {Object<GeoJSON Feature>} feature
 * @returns {Object} - key value pairs of osm tags for feature (removed uninteresting tags)
 */
function getTags (feature) {
  // FIXME: get from app consts
  const uninterestingProps = [
    'id',
    'version',
    'user',
    'uid',
    'changeset',
    'timestamp',
    'icon',
    'ndrefs'
  ]
  return _omit(feature.properties, uninterestingProps)
}
