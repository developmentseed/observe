import { DOMParser } from 'xmldom'
import _omit from 'lodash.omit'
import { nonpropKeys } from '../utils/uninterestingKeys'
import _get from 'lodash.get'
import _uniq from 'lodash.uniq'
import { isInvalidFeature } from '../utils/utils'

/**
 * Takes an edit and transforms it into `osmChange` XML to be uploaded to the OSM API
 * @param {Object} edit - an "edit" item, containing `type`, `oldFeature` and `newFeature`
 * @param {Number} changesetId - changeset id
 * @param {FeatureCollection} memberNodes - feature collection of member nodes (needed when deleting a way)
 * @return {String<XML>} - osmChange XML string
 */
export default function (edit, changesetId, memberNodes = null) {
  console.log('edit', edit)
  const isSimpleChange = !(edit.newFeature && edit.newFeature.wayEditingHistory)
  if (isSimpleChange) {
    return {
      osmChangeXML: getSimpleChange(edit, changesetId, memberNodes),
      nodeIdMap: null
    }
  } else {
    return getComplexChange(edit, changesetId)
  }
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
    'edge',
    'distance',
    'ways',
    'ndrefs',
    'addedNodes',
    'movedNodes',
    'deletedNodes',
    'modifiedNodes',
    'mergedNodes',
    'membership',
    'dist',
    'index',
    'location'
  ]
  return _omit(feature.properties, uninterestingProps)
}

/**
 *
 * @param {Object} edit - containing newFeature.wayEditingHistory with details of the complex edit
 * @param {Number} changesetId
 */
function getComplexChange (edit, changesetId) {
  console.log('called get complex change')
  let negativeIdCounter = 0

  function getNextNegativeId () {
    negativeIdCounter = negativeIdCounter - 1
    return negativeIdCounter
  }

  // const changes = edit.type === 'create' ? getComplexCreate(edit) : getComplexModify(edit)
  // const { creates, modifies, deletes } = changes
  let creates = []

  let modifies = []

  let deletes = []

  const { wayEditingHistory, ...feature } = edit.newFeature

  feature.properties = { ...edit.newFeature.properties }

  if (feature.properties.id.split('/').length > 1) {
    feature.properties.id = feature.properties.id.split('/')[1]
  }

  const nodeIdMap = wayEditingHistory.way.nodes.reduce((mapping, node, idx) => {
    const id = node.properties.id
    if (isNewId(id)) {
      mapping[id] = getNextNegativeId()
    } else if (id.split('/').length > 1) {
      mapping[id] = id.split('/')[1]
    } else {
      mapping[id] = id
    }
    return mapping
  }, {})

  // replace ndrefs of temporary ids with negative ids generated in mapping above
  feature.properties.ndrefs = feature.properties.ndrefs.map(ref => {
    if (nodeIdMap.hasOwnProperty(ref)) {
      return nodeIdMap[ref]
    } else {
      return ref
    }
  })

  console.log('feature ndrefs', feature.properties.ndrefs)
  wayEditingHistory.addedNodes.forEach(addedNodeId => {
    console.log('added node id', addedNodeId)
    const node = wayEditingHistory.way.nodes.find(nd => nd.properties.id === addedNodeId)
    console.log('node', node)
    const id = node.properties.id
    if (isNewId(id) && !creates.find(create => create.id === nodeIdMap[id])) {
      creates.push({
        type: 'node',
        id: nodeIdMap[id],
        feature: node
      })
    }
  })

  wayEditingHistory.movedNodes.forEach(movedNodeId => {
    const node = wayEditingHistory.way.nodes.find(nd => nd.properties.id === movedNodeId)
    const id = node.properties.id
    modifies.push({
      type: 'node',
      id: nodeIdMap[id],
      feature: node
    })
  })

  wayEditingHistory.deletedNodes.forEach(deletedNodeId => {
    const node = wayEditingHistory.way.nodes.find(nd => nd.properties.id === deletedNodeId)
    const id = node.properties.id
    deletes.push({
      type: 'node',
      id: nodeIdMap[id],
      feature: node
    })
  })

  wayEditingHistory.mergedNodes.forEach(mergedNode => {
    const sourceNodeId = mergedNode.sourceNode
    const node = wayEditingHistory.way.nodes.find(nd => nd.properties.id === sourceNodeId)
    const id = node.properties.id
    const nodeTags = getTags(node)
    if (Object.keys(nodeTags).length === 0) { // node had no other tags, can be deleted
      deletes.push({
        type: 'node',
        id: nodeIdMap[id],
        feature: node
      })
    }
  })

  wayEditingHistory.modifiedSharedWays.forEach(way => {
    if (way.properties.id.split('/').length > 1) {
      way.properties.id = way.properties.id.split('/')[1]
    }
    // if shared way is same as top level feature, ignore
    if (way.properties.id !== feature.properties.id) {
      // if way has only moved nodes, ignore
      if (_get(way, 'properties.addedNodes', []).length > 0 || _get(way, 'properties.deletedNodes', []).length > 0) {
        // for nodes with new ids, retrieve the current negative id mapping
        way.properties.ndrefs = way.properties.ndrefs.map(ndref => {
          if (isNewId(ndref)) {
            return nodeIdMap[ndref]
          } else {
            return ndref
          }
        })

        if (isInvalidFeature(way)) {
          // if the way now contains less than 2 nodes (3 for polygons), delete it
          deletes.push({
            type: 'way',
            id: way.properties.id,
            feature: way
          })
          const ndrefs = _uniq(way.properties.ndrefs)
          ndrefs.forEach(nd => {
            const node = wayEditingHistory.way.nodes.find(n => n.properties.id === `node/${nd}`)
            deletes.push({
              type: 'node',
              id: nodeIdMap[node.properties.id],
              feature: node
            })
          })
        } else {
          // in the normal case, push a modify operation
          modifies.push({
            type: 'way',
            id: way.properties.id,
            feature: way
          })
        }
      }
    }
  })

  // make sure we add the XML for the main feature last to make sure
  // all references have been added before
  if (edit.type === 'create') {
    creates.push({
      type: 'way',
      id: getNextNegativeId(),
      feature
    })
  } else if (edit.type === 'modify') {
    if (isInvalidFeature(feature)) {
      // way does not contain enough nodes, delete it.
      deletes.push({
        type: 'way',
        id: feature.properties.id,
        feature
      })
      const ndrefs = _uniq(feature.properties.ndrefs)
      ndrefs.forEach(nd => {
        const node = wayEditingHistory.way.nodes.find(n => n.properties.id === `node/${nd}`)
        deletes.push({
          type: 'node',
          id: nodeIdMap[node.properties.id],
          feature: node
        })
      })
    } else if (wayEditingHistory.addedNodes.length > 0 || wayEditingHistory.deletedNodes.length > 0 || wayEditingHistory.mergedNodes.length > 0) {
      // if feature is modified, we only need to include in change XML if nodes
      // were added or removed
      modifies.push({
        type: 'way',
        id: feature.properties.id,
        feature
      })
    } else {
      // if way has only moved nodes, do nothing
    }
  }

  const XMLForChanges = getXMLForChanges({ creates, modifies, deletes }, changesetId)
  return {
    osmChangeXML: XMLForChanges,
    nodeIdMap: nodeIdMap
  }
}

function getXMLForChanges ({ creates, modifies, deletes }, changesetId) {
  const xmlRoot = '<osmChange></osmChange>'
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlRoot, 'text/xml')
  const rootElem = xmlDoc.getElementsByTagName('osmChange')
  if (creates.length > 0) {
    const createNode = xmlDoc.createElement('create')
    creates.forEach(create => {
      const featureType = create.type
      const feature = create.feature
      const id = create.id
      const elemNode = xmlDoc.createElement(featureType)
      elemNode.setAttribute('id', id) // TODO: Verify id is consistent
      elemNode.setAttribute('changeset', changesetId)
      elemNode.setAttribute('version', 1) // QUESTION: is this correct for new features?
      if (featureType === 'node') {
        elemNode.setAttribute('lon', feature.geometry.coordinates[0])
        elemNode.setAttribute('lat', feature.geometry.coordinates[1])
      }
      const tags = getTags(feature)
      addTags(xmlDoc, elemNode, tags)

      if (featureType === 'way') {
        addNdrefs(xmlDoc, elemNode, feature.properties.ndrefs)
      }
      createNode.appendChild(elemNode)
    })
    rootElem[0].appendChild(createNode)
  }
  if (modifies.length > 0) {
    const modifyNode = xmlDoc.createElement('modify')
    modifies.forEach(modify => {
      const featureType = modify.type
      const feature = modify.feature
      const id = modify.id
      const elemNode = xmlDoc.createElement(featureType)
      elemNode.setAttribute('id', id)
      elemNode.setAttribute('changeset', changesetId)
      elemNode.setAttribute('version', feature.properties.version)
      if (featureType === 'node') {
        elemNode.setAttribute('lon', feature.geometry.coordinates[0])
        elemNode.setAttribute('lat', feature.geometry.coordinates[1])
      }
      const tags = getTags(feature)
      addTags(xmlDoc, elemNode, tags)
      if (featureType === 'way') {
        addNdrefs(xmlDoc, elemNode, feature.properties.ndrefs)
      }
      modifyNode.appendChild(elemNode)
    })
    rootElem[0].appendChild(modifyNode)
  }
  if (deletes.length > 0) {
    const deleteNode = xmlDoc.createElement('delete')
    deleteNode.setAttribute('if-unused', 'true')
    deletes.forEach(del => {
      const featureType = del.type
      const feature = del.feature
      const id = del.id
      const elemNode = xmlDoc.createElement(featureType)
      elemNode.setAttribute('id', id)
      elemNode.setAttribute('changeset', changesetId)
      elemNode.setAttribute('version', feature.properties.version)
      if (featureType === 'node') {
        elemNode.setAttribute('lon', feature.geometry.coordinates[0])
        elemNode.setAttribute('lat', feature.geometry.coordinates[1])
      }
      const tags = getTags(feature)
      addTags(xmlDoc, elemNode, tags)
      if (featureType === 'way') {
        addNdrefs(xmlDoc, elemNode, feature.properties.ndrefs)
      }
      deleteNode.appendChild(elemNode)
    })
    rootElem[0].appendChild(deleteNode)
  }
  // console.log('xml', xmlDoc.toString())
  return xmlDoc.toString()
}

function addTags (xmlDoc, elem, tags) {
  Object.keys(tags).forEach(key => {
    const tagElem = xmlDoc.createElement('tag')
    tagElem.setAttribute('k', key)
    tagElem.setAttribute('v', tags[key])
    elem.appendChild(tagElem)
  })
  return elem
}

function addNdrefs (xmlDoc, elem, refs) {
  refs.forEach(ref => {
    ref = String(ref) // normalize to strings
    if (ref.split('/').length > 1) {
      ref = ref.split('/')[1]
    }
    const refElem = xmlDoc.createElement('nd')
    refElem.setAttribute('ref', ref)
    elem.appendChild(refElem)
  })
  return elem
}

function isNewId (id) {
  id = String(id)
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
  addTags(xmlDoc, changeNode, tags)

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
