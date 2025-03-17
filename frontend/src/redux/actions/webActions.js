import custAxios from "../../services/axiosConfig";
import { errorMessage, successMessage } from "../../globalFunctions";
import { webConstants } from "../constants/webContants";
import { adminConstants } from "../constants/adminContants";

export const fetchFeaturedLawyers = () => async (dispatch) => {
  dispatch({ type: webConstants.FETCH_FEATURED_LAWYER_REQUEST });
  try {
    const res = await custAxios.get("/website/featured-lawyers");
    if (res?.data?.res === "success") {
      dispatch({
        type: webConstants.FETCH_FEATURED_LAWYER_SUCCESS,
        payload: res?.data.data,
      });
      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: webConstants.FETCH_FEATURED_LAWYER_SUCCESS,
        payload: [],
      });
      dispatch({
        type: webConstants.FETCH_FEATURED_LAWYER_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: webConstants.FETCH_FEATURED_LAWYER_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};
export const getLawyerById = (id) => async (dispatch) => {
  dispatch({ type: webConstants.GET_LAWYER_BY_ID_REQUEST });
  try {
    const res = await custAxios.get(`website/lawyer/${id}`);
    if (res?.data?.res === "success") {
      dispatch({
        type: webConstants.GET_LAWYER_BY_ID_SUCCESS,
        payload: res?.data.data,
      });
    } else if (res?.data?.res === "error") {
      dispatch({
        type: webConstants.GET_LAWYER_BY_ID_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: webConstants.GET_LAWYER_BY_ID_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const findLawyers = (data) => async (dispatch) => {
  dispatch({ type: webConstants.FIND_LAWYER_REQUEST });
  try {
    const res = await custAxios.get(`/website/find-lawyer${data}`);
    if (res?.data?.res === "success") {
      dispatch({
        type: webConstants.FIND_LAWYER_SUCCESS,
        payload: res?.data.data,
      });
    } else if (res?.data?.res === "error") {
      dispatch({
        type: webConstants.FIND_LAWYER_SUCCESS,
        payload: [],
      });
      dispatch({
        type: webConstants.FIND_LAWYER_FAILURE,
        payload: res?.data?.message || "Server Error",
      });
      errorMessage(res?.data?.message);
    }
  } catch (error) {
    dispatch({
      type: webConstants.FIND_LAWYER_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message);
  }
};

export const fetchPracticeList = () => async (dispatch) => {
  dispatch({ type: webConstants.FETCH_PRACTICE_REQUEST });
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role == "superadmin") {
    role = "super-admin";
  }
  try {
    const res = await custAxios.get(`${role}/area-Practice/list`);
    if (res?.data?.res === "success") {
      dispatch({
        type: webConstants.FETCH_PRACTICE_SUCCESS,
        payload: res?.data.data,
      });
    } else if (res?.data?.res === "error") {
      dispatch({
        type: webConstants.FETCH_PRACTICE_SUCCESS,
        payload: [],
      });
      dispatch({
        type: webConstants.FETCH_PRACTICE_FAILURE,
        payload: res?.data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: webConstants.FETCH_PRACTICE_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const getJurisdictionByCountry = (country) => async (dispatch) => {
  dispatch({ type: webConstants.GET_JURISDICTION_BY_COUNTRY_REQUEST });
  try {
    const res = await custAxios.get(
      `website/jurisdiction?country_id=${country}`
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: webConstants.GET_JURISDICTION_BY_COUNTRY_SUCCESS,
        payload: res?.data.data,
      });
    } else if (res?.data?.res === "error") {
      dispatch({
        type: webConstants.GET_JURISDICTION_BY_COUNTRY_SUCCESS,
        payload: [],
      });
      dispatch({
        type: webConstants.GET_JURISDICTION_BY_COUNTRY_FAILURE,
        payload: res?.data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: webConstants.GET_JURISDICTION_BY_COUNTRY_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};
export const getCountriesOfJurisdictions = () => async (dispatch) => {
  dispatch({ type: webConstants.GET_COUNTRIES_OF_JURISDICTIONS_REQUEST });
  try {
    const res = await custAxios.get(`website/countries`);
    if (res?.data?.res === "success") {
      dispatch({
        type: webConstants.GET_COUNTRIES_OF_JURISDICTIONS_SUCCESS,
        payload: res?.data.data || [],
      });
    } else if (res?.data?.res === "error") {
      dispatch({
        type: webConstants.GET_COUNTRIES_OF_JURISDICTIONS_SUCCESS,
        payload: [],
      });
      dispatch({
        type: webConstants.GET_COUNTRIES_OF_JURISDICTIONS_FAILURE,
        payload: res?.data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: webConstants.GET_COUNTRIES_OF_JURISDICTIONS_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};
export const fetchWebDetails = () => async (dispatch) => {
  dispatch({ type: webConstants.FETCH_WEB_DETAILS_REQUEST });
  try {
    const res = await custAxios.get(`website/website-details`); 
    if (res?.data?.res === "success") {
      dispatch({
        type: webConstants.FETCH_WEB_DETAILS_SUCCESS,
        payload: res?.data.data,
      });
      localStorage.setItem("webDetails", JSON.stringify(res?.data.data));
    } else if (res?.data?.res === "error") {
      dispatch({
        type: webConstants.FETCH_WEB_DETAILS_SUCCESS,
        payload: [],
      });
      dispatch({
        type: webConstants.FETCH_WEB_DETAILS_FAILURE,
        payload: res?.data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: webConstants.FETCH_WEB_DETAILS_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const subscribe = (data) => async (dispatch) => {
  dispatch({ type: webConstants.SUBSCRIBE_REQUEST });
  try {
    const res = await custAxios.post(`newsletters/subscribe`, data);
    if (res?.data?.res === "success") {
      dispatch({
        type: webConstants.SUBSCRIBE_SUCCESS,
        payload: res?.data.data,
      });
      successMessage("Subscribe Successfully");
      return res?.data;
    } else if (res?.data?.res === "error") {
      dispatch({
        type: webConstants.SUBSCRIBE_SUCCESS,
        payload: [],
      });
      dispatch({
        type: webConstants.SUBSCRIBE_FAILURE,
        payload: res?.data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: webConstants.SUBSCRIBE_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const unSubscribe = (email) => async (dispatch) => {
  dispatch({ type: webConstants.UNSUBSCRIBE_REQUEST });
  try {
    const res = await custAxios.get(`newsletters/unsubscribe/${email}`);
    if (res?.data?.res === "success") {
      dispatch({
        type: webConstants.UNSUBSCRIBE_SUCCESS,
        payload: res?.data.data,
      });
      return res?.data;
    } else if (res?.data?.res === "error") {
      dispatch({
        type: webConstants.UNSUBSCRIBE_SUCCESS,
        payload: [],
      });
      dispatch({
        type: webConstants.UNSUBSCRIBE_FAILURE,
        payload: res?.data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: webConstants.UNSUBSCRIBE_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const postMessageOfContactUs = (data) => async (dispatch) => {
  dispatch({ type: webConstants.POST_A_MESSAGE_REQUEST });
  try {
    const res = await custAxios.post(`contact/send-email`, data);
    if (res?.data?.res === "success") {
      dispatch({
        type: webConstants.POST_A_MESSAGE_SUCCESS,
        payload: res?.data.data,
      });
      return res?.data;
    } else if (res?.data?.res === "error") {
      dispatch({
        type: webConstants.POST_A_MESSAGE_SUCCESS,
        payload: [],
      });
      dispatch({
        type: webConstants.POST_A_MESSAGE_FAILURE,
        payload: res?.data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: webConstants.POST_A_MESSAGE_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message);
  }
};

export const fetchFAQsListForWeb = () => async (dispatch) => {
  // console.log(values);
  dispatch({ type: webConstants.FETCH_FAQS_REQUEST });
  try {
    const res = await custAxios.get("website/faqs");
    if (res?.data?.res === "success") {
      dispatch({
        type: webConstants.FETCH_FAQS_SUCCESS,
        payload: res?.data.data,
      });

      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: webConstants.FETCH_FAQS_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: webConstants.FETCH_FAQS_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const fetchCarouselsForHomePage = () => async (dispatch) => {
  // console.log(values);
  dispatch({ type: webConstants.FETCH_CAROUSELS_REQUEST });
  try {
    const res = await custAxios.get("website/carousel");
    if (res?.data?.res === "success") {
      dispatch({
        type: webConstants.FETCH_CAROUSELS_SUCCESS,
        payload: res?.data.data,
      });

      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: webConstants.FETCH_CAROUSELS_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: webConstants.FETCH_CAROUSELS_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    console.error(error);
    errorMessage(error?.response?.data?.message);
  }
};

export const newContactUsMessage = (data) => async (dispatch) => {
  dispatch({ type: adminConstants.NEW_CONTACT_US_MESSAGES_REQUEST });
  try {
    dispatch({
      type: adminConstants.NEW_CONTACT_US_MESSAGES_SUCCESS,
      payload: { ...data, responses: [] },
    });
  } catch (error) {
    console.error(error);
    dispatch({
      type: adminConstants.NEW_CONTACT_US_MESSAGES_FAILURE,
      payload: data,
    });
    errorMessage(error);
  }
};
