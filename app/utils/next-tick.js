/**
 * Emulate nextTick, return a Promise instead of accepting callback
 */
export default function () {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 0)
  })
}
