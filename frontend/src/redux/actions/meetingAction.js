import { errorMessage, successMessage } from "../../globalFunctions";
import custAxios, { attachToken } from "../../services/axiosConfig";
import { meetingConstants } from "../constants/meetingConstants";

export const meetingCheck = (id) => async (dispatch) => {
  dispatch({ type: meetingConstants.CHECK_MEETING_REQUEST });

  let userRole = JSON.parse(localStorage.getItem("user")).role;
  if (userRole === "Client") {
    userRole = "client";
  } else if (userRole === "Lawyer") {
    userRole = "lawyer";
  }

  try {
    attachToken();
    const res = await custAxios.get(`${userRole}/meeting/check-meeting/${id}`);
    if (res?.data?.res === "error") {
      dispatch({
        type: meetingConstants.CHECK_MEETING_FAILURE,
        payload: res?.message,
      });
      return "error";
    }
    if (res?.data?.res === "warning") {
      errorMessage(res?.data?.message);
    }
    if (res?.data?.res === "success") {
      successMessage(res?.data?.message);
    }
    dispatch({
      type: meetingConstants.CHECK_MEETING_SUCCESS,
      payload: res?.data,
    });

    return res?.data;
  } catch (error) {
    dispatch({
      type: meetingConstants.CHECK_MEETING_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message);
  }
};
export const meetingEnd = (id) => async (dispatch) => {
  dispatch({ type: meetingConstants.CHECK_MEETING_REQUEST });

  let userRole = JSON.parse(localStorage.getItem("user")).role;
  if (userRole === "Client") {
    userRole = "client";
  } else if (userRole === "Lawyer") {
    userRole = "lawyer";
  }

  try {
    attachToken();
    const res = await custAxios.get(`${userRole}/meeting/end-meeting/${id}`);
    if (res?.data?.res === "error") {
      dispatch({
        type: meetingConstants.END_MEETING_FAILURE,
        payload: res?.message,
      });
      return "error";
    }
    if (res?.data?.res === "warning") {
      errorMessage(res?.data?.message);
    }
    if (res?.data?.res === "success") {
      successMessage(res?.data?.message);
    }
    dispatch({
      type: meetingConstants.END_MEETING_SUCCESS,
      payload: res?.data,
    });

    return res?.data;
  } catch (error) {
    dispatch({
      type: meetingConstants.END_MEETING_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message);
  }
};
