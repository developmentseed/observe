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

export function isInvalidFeature (feature) {
  return (
    (feature.geometry.type === 'LineString' && feature.properties.ndrefs.length < 2) ||
    (feature.geometry.type === 'Polygon' && feature.properties.ndrefs.length < 3)
  )
}
