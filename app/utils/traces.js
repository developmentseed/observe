
export function getNewTrace () {
  return {
    points: []
  }
}

export function getPoint(location) {
  return {...location.coords}
}
