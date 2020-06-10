import * as types from './actionTypes'

export function undo () {
  return {
    type: types.UNDOABLE_UNDO
  }
}

export function redo () {
  return {
    type: types.UNDOABLE_REDO
  }
}
