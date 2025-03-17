import { formConstants } from "../constants/formContants";

export const formReducer = (
  state = {
    jurisdictions: [],
    practice: [],
    countries: [],
    states: [],
  },
  action
) => {
  switch (action.type) {
    case formConstants.FETCH_COUNTRIES_REQUEST:
    case formConstants.FETCH_STATES_REQUEST:
    case formConstants.FETCH_PRACTICE_REQUEST:
    case formConstants.FETCH_JURISDICTIONS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case formConstants.FETCH_COUNTRIES_SUCCESS:
      return {
        ...state,
        loading: false,
        countries: action.payload,
      };

    case formConstants.FETCH_STATES_SUCCESS:
      return {
        ...state,
        loading: false,
        states: action.payload,
      };

    case formConstants.FETCH_PRACTICE_SUCCESS:
      return {
        ...state,
        loading: false,
        practice: action.payload,
      };

    case formConstants.FETCH_JURISDICTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        jurisdictions: action.payload,
      };

    case formConstants.FETCH_COUNTRIES_FAILURE:
    case formConstants.FETCH_STATES_FAILURE:
    case formConstants.FETCH_PRACTICE_FAILURE:
    case formConstants.FETCH_JURISDICTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };

    case formConstants.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
