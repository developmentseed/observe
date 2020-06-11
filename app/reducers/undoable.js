import * as types from '../actions/actionTypes'

export default function undoable (reducer) {
  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    future: []
  }

  return function (state = initialState, action) {
    const { past, present, future } = state

    switch (action.type) {
      case types.UNDOABLE_UNDO: {
        const previous = past[past.length - 1]
        if (!previous) {
          return state
        }

        const newPast = past.slice(0, past.length - 1)

        return {
          past: newPast,
          present: previous,
          future: [present, ...future]
        }
      }

      case types.UNDOABLE_REDO: {
        const next = future[0]

        if (!next) {
          return state
        }

        const newFuture = future.slice(1)

        return {
          past: [...past, present],
          present: next,
          future: newFuture
        }
      }

      default: {
        const newPresent = reducer(present, action)

        if (present === newPresent) {
          return state
        }

        let newPast = [...past, present]

        return {
          past: newPast,
          present: newPresent,
          future: []
        }
      }
    }
  }
}
