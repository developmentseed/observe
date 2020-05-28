export function isNewId (id) {
  id = String(id)
  return id.startsWith('observe-')
}
