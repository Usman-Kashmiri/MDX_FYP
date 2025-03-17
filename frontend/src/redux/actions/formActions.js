import custAxios from "../../services/axiosConfig";
import { errorMessage } from "../../globalFunctions";
import { formConstants } from "../constants/formContants";

export const fetchCountries = () => async (dispatch) => {
  dispatch({ type: formConstants.FETCH_COUNTRIES_REQUEST });
  try {
    const res = await custAxios.get("/website/countries");
    if (res?.data?.res === "success") {
      dispatch({
        type: formConstants.FETCH_COUNTRIES_SUCCESS,
        payload: res?.data.data,
      });
    }
  } catch (error) {
    dispatch({
      type: formConstants.FETCH_COUNTRIES_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
   errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const fetchStates = (country_id) => async (dispatch) => {
  dispatch({ type: formConstants.FETCH_STATES_REQUEST });
  try {
    const res = await custAxios.post("/website/state", {
      country_id: country_id,
    });
    if (res?.data?.res === "success") {
      dispatch({
        type: formConstants.FETCH_STATES_SUCCESS,
        payload: res?.data.data,
      });
    }
  } catch (error) {
    dispatch({
      type: formConstants.FETCH_STATES_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
   errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const fetchPractice = () => async (dispatch) => {
  dispatch({ type: formConstants.FETCH_PRACTICE_REQUEST });
  try {
    const res = await custAxios.get("/website/area-expertise");
    if (res?.data?.res === "success") {
      dispatch({
        type: formConstants.FETCH_PRACTICE_SUCCESS,
        payload: res?.data.data,
      });
    }
  } catch (error) {
    dispatch({
      type: formConstants.FETCH_PRACTICE_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
   errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const fetchJurisdictions = () => async (dispatch) => {
  dispatch({ type: formConstants.FETCH_JURISDICTIONS_REQUEST });
  try {
    const res = await custAxios.get("/website/jurisdiction");
    if (res?.data?.res === "success") {
      dispatch({
        type: formConstants.FETCH_JURISDICTIONS_SUCCESS,
        payload: res?.data.data,
      });
    }
  } catch (error) {
    dispatch({
      type: formConstants.FETCH_JURISDICTIONS_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
   errorMessage(error?.response?.data?.message || "Server Error");
  }
};
