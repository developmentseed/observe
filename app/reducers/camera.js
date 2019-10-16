import * as types from '../actions/actionTypes'

export const initialState = {
  photos: []
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.SAVED_PHOTO: {
      let photos = [...state.photos]
      photos.push(action.photo)
      console.log('saved', photos)
      return {
        ...state,
        photos
      }
    }

    case types.SAVE_PHOTO_FAILED: {
      console.log('save photo failed')
    }
  }
  return state
}
