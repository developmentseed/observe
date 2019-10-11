import * as types from '../actions/actionTypes'

export const initialState = {
  photos: []
}

export default async function (state = initialState, action) {
  switch (action.type) {
    case types.SAVED_PHOTO: {
      return {
        ...state,
        photos: [...state.photos, action.photo]
      }
    }

    case types.SAVE_PHOTO_FAILED: {
      console.log('save photo failed')
    }
  }
}
