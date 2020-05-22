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
  const isSimpleChange = !(edit.newFeature && edit.newFeature.wayEditHistory)
  return isSimpleChange ? getSimpleChange(edit, changesetId, memberNodes) : getComplexChange(edit, changesetId)
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

/**
 * 
 * @param {Object} edit - containing newFeature.wayEditHistory with details of the complex edit 
 * @param {Number} changesetId 
 */
function getComplexChange(edit, changesetId) {
  let negativeIdCounter = 0

  function getNextNegativeId () {
    negativeIdCounter = negativeIdCounter - 1
    return negativeIdCounter
  }

  // const changes = edit.type === 'create' ? getComplexCreate(edit) : getComplexModify(edit)
  // const { creates, modifies, deletes } = changes
  const creates = [],
    modifies = [],
    deletes = []

  const { wayEditHistory, ...feature }  = edit.newFeature

  const nodeIdMap = wayEditHistory.way.nodes.reduce((mapping, node, idx) => {
    const id = node.properties.id
    if (isNewId(id)) {
      mapping[id] = getNextNegativeId()
    } else {
      mapping[id] = id
    }
    return id
  }, {})

  // replace ndrefs of temporary ids with negative ids generated in mapping above
  feature.properties.ndrefs = feature.properties.ndrefs.map(ref => nodeIdMap[ref])

  if (edit.type === 'create') {
    creates.push({
      type: 'way',
      id: getNextNegativeId(),
      feature
    })
  } else if (edit.type === 'modify') {

    // if feature is modified, we only need to include in change XML if nodes
    // were added or removed
    if (wayEditHistory.addedNodes.length > 0 || wayEditHistory.deletedNodes.length > 0 || wayEditHistory.mergedNodes.length > 0) {
      modifies.push({
        type: 'way',
        id: feature.properties.id,
        feature
      })
    }
  }

  wayEditHistory.addedNodes.forEach(addedNodeId => {
    const node = wayEditHistory.nodes.find(nd => nd.properties.id === addedNodeId)
    const id = node.properties.id
    creates.push({
      type: 'node',
      id: nodeIdMap[id],
      feature: node
    })
  })
  
  wayEditHistory.movedNodes.forEach(movedNodeId => {
    const node = wayEditHistory.nodes.find(nd => nd.properties.id === movedNodeId)
    modifies.push({
      type: 'node',
      id: node.properties.id,
      feature: node
    })
  })

  wayEditHistory.deletedNodes.forEach(deletedNodeId => {
    const node = wayEditHistory.nodes.find(nd => nd.properties.id === deletedNodeId)
    deletes.push({
      type: 'node',
      id: node.properties.id,
      feature: node
    })
  })

  wayEditHistory.modifiedSharedWays.forEach(way => {
    
    // if shared way is same as top level feature, ignore
    if (way.properties.id !== feature.properties.id) {
      // if way has only moved nodes, ignore
      if (way.addedNodes.length > 0 || way.deletedNodes.length > 0) {

        // for nodes with new ids, retrieve the current negative id mapping
        way.properties.ndrefs = way.properties.ndrefs.map(ndref => {
          if (isNewId(ndref)) {
            return nodeIdMap[ndref]
          } else {
            return ndref
          }
        })

        modifies.push({
          type: 'way',
          id: way.properties.id,
          feature: way
        })
      }
    }
  })

  return getXMLForChanges({creates, modifies, deletes})

}

function getXMLForChanges ({ creates, modifies, deletes }) {
  const xmlRoot = '<osmChange></osmChange>'
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlRoot, 'text/xml')
  // TODO: Loop through creates, modifies, deletes and create
  // XML structure accordingly    
}


function isNewId (id) {
  return id.startsWith('observe-')
}

/**
 * Function to get XML for "simple" changes that result in a single change operation
 * For the more complex case of way edits, where other ways may be affected, etc. we use
 * getComplexChange 
 */
function getSimpleChange (edit, changesetId, memberNodes) {
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
