import { errorMessage } from "../../globalFunctions";
import custAxios, { attachToken } from "../../services/axiosConfig";
import { notificationsConstants } from "../constants/notificationsConstants";

export const getNotifications = (status = "all", pagination) => async (dispatch) => {
  dispatch({ type: notificationsConstants.GET_NOTIFICATIONS_REQUEST });
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  attachToken();
  try {
    const { page, per_page } = pagination;
    const res = await custAxios.get(
      `${role}/notifications?status=${status}&page=${page}&per_page=${per_page}`
    );
    if (res?.data?.success) {
      dispatch({
        type: notificationsConstants.GET_NOTIFICATIONS_SUCCESS,
        payload: res?.data?.data,
      });
      return res.data;
    }
  } catch (error) {
    dispatch({
      type: notificationsConstants.GET_NOTIFICATIONS_SUCCESS,
      payload: [],
    });
    dispatch({
      type: notificationsConstants.GET_NOTIFICATIONS_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
  }
};

export const deleteNotifications = (id) => async (dispatch) => {
  try {
    dispatch({ type: notificationsConstants.DELETE_NOTIFICATION_REQUEST });
    let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
    attachToken();
    const res = await custAxios.delete(`${role}/notification/${id}`);
    if (res?.data?.success) {
      dispatch({
        type: notificationsConstants.DELETE_NOTIFICATION_SUCCESS,
        payload: id,
      });
    }
    return res.data;
  } catch (error) {
    dispatch({
      type: notificationsConstants.DELETE_NOTIFICATION_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(
      error?.response?.data?.message || "Couldn't dismiss notification!"
    );
  }
};
export const readNotifications = (id) => async (dispatch) => {
  try {
    dispatch({ type: notificationsConstants.READ_NOTIFICATION_REQUEST });
    let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
    attachToken();
    const res = await custAxios.put(`${role}/notification/${id}`);
    if (res?.data?.success) {
      countUnredNotifications()
      dispatch({
        type: notificationsConstants.READ_NOTIFICATION_SUCCESS,
        payload: id,
      });
    }
    return res.data;
  } catch (error) {
    dispatch({
      type: notificationsConstants.READ_NOTIFICATION_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(
      error?.response?.data?.message || "Couldn't read notification!"
    );
  }
};

export const countUnredNotifications = () => async (dispatch) => {
  try {
    dispatch({ type: notificationsConstants.COUNT_NOTIFICATION_REQUEST });
    let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
    attachToken();
    const res = await custAxios.get(`${role}/notification/count`);

    if (res?.data?.success) {
      dispatch({
        type: notificationsConstants.COUNT_NOTIFICATION_SUCCESS,
        payload: res?.data?.data,
      });
    }
    return res.data;
  } catch (error) {
    dispatch({
      type: notificationsConstants.COUNT_NOTIFICATION_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(
      error?.response?.data?.message || "Couldn't read notification!"
    );
  }
};