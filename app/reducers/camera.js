import * as types from '../actions/actionTypes'

export const initialState = {
  photos: []
}

export default async function (state = initialState, action) {
  switch (action.type) {
    case types.SAVING_PHOTO: {
      console.log('saving photo')
      return {
        ...state
      }
    }
    case types.SAVED_PHOTO: {
      console.log('saved photo', action.path)
      return {
        ...state,
        photos: [...state.photos, action.path]
      }
    }

    case types.SAVE_PHOTO_FAILED: {
      console.log('save photo failed')
    }
  }
}
