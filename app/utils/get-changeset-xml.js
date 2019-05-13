import { DOMParser } from 'xmldom'

/**
 * @param {Object} tags - object containing key-values of tags to add to changeset
 */
export default function getChangesetXML (tags) {
  const xmlRoot = '<osm></osm>'
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlRoot, 'text/xml')
  const rootElem = xmlDoc.getElementsByTagName('osm')
  const changeset = xmlDoc.createElement('changeset')
  Object.keys(tags).forEach(k => {
    const tagElem = xmlDoc.createElement('tag')
    tagElem.setAttribute('k', k)
    tagElem.setAttribute('v', tags[k])
    changeset.appendChild(tagElem)
  })
  rootElem[0].appendChild(changeset)
  return xmlDoc.toString()
}
