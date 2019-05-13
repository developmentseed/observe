export default function storage () {
  return {
    getItem: () => Promise.resolve(),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve()
  }
}
