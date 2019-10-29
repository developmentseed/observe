
/**
 * Converts an object like {a: 1, b: 'foo'} into "a=1&b=foo"
 * @param {*} obj 
 */
export function objToQueryString (obj) {
  return Object.keys(obj).map(key => {
    return `${key}=${obj[key]}`
  }).join('&')
}