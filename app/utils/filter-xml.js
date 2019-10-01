/**
 * Function to remove relations from the OSM XML
 * @param {DOM} xml
 * @return {DOM} xml - without relations
 */
export function filterRelations (xml) {
  const relations = xml.getElementsByTagName('relation')
  const relArray = Array.from(relations)
  relArray.forEach(r => {
    xml.documentElement.removeChild(r)
  })

  return xml
}
