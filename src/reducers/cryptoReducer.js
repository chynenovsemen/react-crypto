import { SET_CRYPTO_LIST, SET_CRYPTO_TO_DISPLAY, SET_LOGOS, SET_IS_LOADING, SET_ERROR, SET_DIRECTION } from './types'

export default function cryptoReducer(state, action) {
  switch (action.type) {
    case SET_CRYPTO_LIST:
      return {
        ...state,
        cryptoList: action.payload
      };
    case SET_CRYPTO_TO_DISPLAY:
      return {
        ...state,
        cryptoToDisplay: action.payload
      };
    case SET_DIRECTION:
      return {
        ...state,
        direction: action.payload
      };
    case SET_LOGOS:
    return {
      ...state,
      logos: action.payload
    };
    case SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case SET_ERROR:
      return {
      ...state,
      error: action.error
    };
    default:
      return state;
  }
}