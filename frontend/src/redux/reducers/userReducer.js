import { userConstants } from "../constants/userConstants";

export const userReducer = (
  state = {
    loading: false,
    error: null,
  },
  action
) => {
  switch (action.type) {
    case userConstants.UPDATE_PERSONAL_INFO_REQUEST: // ? Update personal info request
    case userConstants.CREATE_USER_REVIEW_REQUEST: // ? Update personal info request
    case userConstants.UPDATE_PROFILE_PICTURE_REQUEST: // ? Update profile picture request
      return {
        ...state,
        loading: true,
      };

    case userConstants.UPDATE_PERSONAL_INFO_SUCCESS: // ? Update personal info success
    case userConstants.CREATE_USER_REVIEW_SUCCESS: // ? Update personal info success
    case userConstants.UPDATE_PROFILE_PICTURE_SUCCESS: // ? Update profile picture success
      return {
        ...state,
        loading: false,
      };

    case userConstants.UPDATE_PERSONAL_INFO_FAILURE: // ? Update personal info failure
    case userConstants.CREATE_USER_REVIEW_FAILURE: // ? Update personal info failure
    case userConstants.UPDATE_PROFILE_PICTURE_FAILURE: // ? Update profile picture failure
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default: // ? defaaaalt case yk...!
      return state;
  }
};
