export function getPhotosForFeature (photos, featureId) {
  /** Return an object with photos associated with a given feature */
  const featurePhotos = photos.filter(photo => {
    if (photo.featureId && photo.featureId === featureId) {
      return photo
    }
  })
  return featurePhotos
}
