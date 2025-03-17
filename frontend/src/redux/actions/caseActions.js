import custAxios, { attachToken } from "../../services/axiosConfig";
import { errorMessage, successMessage } from "../../globalFunctions";
import { caseConstants } from "../constants/caseConstants";

export const fetchCases =
  (status = "all") =>
  async (dispatch) => {
    dispatch({
      type: caseConstants.FETCH_CASES_REQUEST,
    });
    try {
      attachToken();
      const res = await custAxios.get(`/client/cases/${status}`);
      if (res?.data?.res === "success") {
        dispatch({
          type: caseConstants.FETCH_CASES_SUCCESS,
          payload: res.data.data,
        });
        return res.data.data;
      }

      dispatch({
        type: caseConstants.FETCH_CASES_FAILURE,
        payload: res.data.message || "Internal server error",
      });
      return "failure";
    } catch (error) {
      dispatch({
        type: caseConstants.FETCH_CASES_FAILURE,
        payload: error.response.data.message || "Server Error",
      });
      // errorMessage(error?.response?.data?.message || "Server Error");
      // errorMessage(error?.response?.data?.message || "Server Error");
    }
  };

export const initiateCaseRequest = (case_id, lawyer_id) => async (dispatch) => {
  dispatch({
    type: caseConstants.CASE_REQUEST,
  });
  try {
    attachToken();
    const res = await custAxios.post(`/client/case-request`, {
      case_id,
      lawyer_id,
    });
    if (res?.data?.res === "success") {
      dispatch({
        type: caseConstants.CASE_REQUEST_SUCCESS,
      });
      return res.data.data;
    }

    dispatch({
      type: caseConstants.CASE_REQUEST_FAILURE,
      payload: res.data.message || "Internal server error",
    });
    return "failure";
  } catch (error) {
    dispatch({
      type: caseConstants.FETCH_CASES_FAILURE,
      payload: error.response.data.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const submitCase = (values) => async (dispatch) => {
  dispatch({
    type: caseConstants.SUBMIT_CASE_REQUEST,
  });
  try {
    attachToken();
    const res = await custAxios.post("/client/submit-case", values);
    if (res?.data?.success) {
      dispatch({
        type: caseConstants.SUBMIT_CASE_SUCCESS,
        payload: res.data.data,
      });
      successMessage(res.data.message);
      return res.data;
    }

    dispatch({
      type: caseConstants.SUBMIT_CASE_FAILURE,
      payload: res.data.error || "Internal server error",
    });
    return "failure";
  } catch (error) {
    dispatch({
      type: caseConstants.SUBMIT_CASE_FAILURE,
      payload: error?.response?.data?.error || "Server Error",
    });
    errorMessage(error.response.data.error);
  }
};
