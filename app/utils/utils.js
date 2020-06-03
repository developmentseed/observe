export function isNewId (id) {
  id = String(id)
  return id.startsWith('observe-')
}

export function isWayPendingUpload (feature) {
  const id = feature.properties.id.split('/')[1]
  const ndrefs = feature.properties.ndrefs ? feature.properties.ndrefs.length : undefined

  if (isNewId(id) && ndrefs) {
    return true
  } else {
    return false
  }
}
