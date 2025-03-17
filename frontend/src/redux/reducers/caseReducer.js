import { caseConstants } from "../constants/caseConstants";

export const caseReducer = (
  state = {
    loading: false,
    areaOfPractice: null,
    caseDescription: "",
    caseSummary: "",
    case: null,
    cases: [],
  },
  action
) => {
  switch (action.type) {
    case caseConstants.CASE_REQUEST: // ? initializing case request
    case caseConstants.SUBMIT_CASE_REQUEST: // ? submit case for practice area suggestion
    case caseConstants.FETCH_CASES_REQUEST: // ? fetch cases
      return {
        ...state,
        loading: true,
      };

    case caseConstants.SUBMIT_CASE_SUCCESS: // ? submit case for practice area suggestion success
      return {
        ...state,
        loading: false,
        areaOfPractice: action?.payload?.area_of_practice,
        caseDescription: action?.payload?.case?.case,
        caseSummary: action?.payload?.case?.case_summary,
        case: action?.payload?.case,
      };

    case caseConstants.CASE_REQUEST_SUCCESS: // ? initializing case request success
      return {
        ...state,
        loading: false,
      };

    case caseConstants.FETCH_CASES_SUCCESS: // ? initializing case request success
      return {
        ...state,
        loading: false,
        cases: action?.payload,
      };

    case caseConstants.CASE_REQUEST_FAILURE: // ? initializing case request failure
    case caseConstants.SUBMIT_CASE_FAILURE: // ? submit case for practice area suggestion failure
    case caseConstants.FETCH_CASES_FAILURE: // ? fetch cases failure
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case caseConstants.CLEAR_ERRORS: // ? clear errors
      return {
        ...state,
        error: null,
      };

    default: // ? defaaaalt case yk...!
      return state;
  }
};
