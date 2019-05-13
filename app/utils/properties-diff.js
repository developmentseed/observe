import { nonpropKeys } from './uninterestingKeys'
import _omit from 'lodash.omit'

function propertiesDiff (oldProps, newProps) {
  var ret = {}
  oldProps = _omit(oldProps, nonpropKeys)
  newProps = _omit(newProps, nonpropKeys)
  for (var prop in newProps) {
    ret[prop] = {}
    if (!oldProps.hasOwnProperty(prop)) {
      ret[prop]['added'] = newProps[prop]
    } else {
      var oldValue = oldProps[prop]
      var newValue = newProps[prop]
      if (oldValue === newValue) {
        ret[prop]['unchanged'] = newValue
      } else {
        ret[prop]['modifiedOld'] = oldValue
        ret[prop]['modifiedNew'] = newValue
      }
    }
  }
  for (var oldProp in oldProps) {
    if (!ret.hasOwnProperty(oldProp)) {
      ret[oldProp] = {
        deleted: oldProps[oldProp]
      }
    }
  }
  return ret
}

export default propertiesDiff
