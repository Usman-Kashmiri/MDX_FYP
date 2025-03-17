import custAxios, {
  attachToken,
  attachTokenWithFormAxios,
  formAxios,
} from "../../services/axiosConfig";
import { errorMessage, successMessage } from "../../globalFunctions";
import { userConstants } from "../constants/userConstants";
import { getUserData } from "../../hooks/auth";

export const fetchPersonalInfo = () => async (dispatch) => {
  dispatch({ type: userConstants.FETCH_PERSONAL_INFO_REQUEST });
  try {
    attachToken();
    const res = await custAxios.get("/auth/user-profile");
    if (res) {
      dispatch({
        type: userConstants.FETCH_PERSONAL_INFO_SUCCESS,
        payload: res?.data?.data ? res?.data?.data : res?.data,
      });
    }
  } catch (error) {
    dispatch({
      type: userConstants.FETCH_PERSONAL_INFO_FAILURE,
      payload: error?.response?.data.message,
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};
export const createUserReview = (id) => async (dispatch) => {
  dispatch({ type: userConstants.CREATE_USER_REVIEW_REQUEST });
  try {
    attachToken();
    const res = await custAxios.post(`/lawyer/create-review/${id}`);
    if (res) {
      dispatch({
        type: userConstants.CREATE_USER_REVIEW_SUCCESS,
        payload: res?.data?.res,
      });
    }
  } catch (error) {
    dispatch({
      type: userConstants.CREATE_USER_REVIEW_FAILURE,
      payload: error?.response?.data.message,
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const updateAdminInfo = (values) => async (dispatch) => {
  dispatch({ type: userConstants.UPDATE_PERSONAL_INFO_REQUEST });
  try {
    let role = JSON.parse(localStorage.getItem("user"))
      ?.role.toLowerCase()
      ?.replace("super", "super-");

    const user = getUserData();
    attachToken();
    const res = await custAxios.post(
      `/${role}/update-profile/${user.id}`,
      values
    );
    if (res?.data?.res === "success") {
      dispatch(fetchPersonalInfo());
      dispatch({
        type: userConstants.UPDATE_PERSONAL_INFO_SUCCESS,
      });
      successMessage(res?.data.message);
      return "success";
    } else if (res?.data?.res === "error") {
      errorMessage(res?.data.message);
      return "error";
    }
  } catch (error) {
    dispatch({
      type: userConstants.UPDATE_PERSONAL_INFO_FAILURE,
      payload: error.response.data.message,
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const updateProfilePicture = (role, values) => async (dispatch) => {
  dispatch({
    type: userConstants.UPDATE_PROFILE_PICTURE_REQUEST,
  });
  try {
    const formData = new FormData();
    formData.append("image", values);

    let endPoint;
    role === "SuperAdmin"
      ? (endPoint = "/super-admin/profile-pic")
      : role === "Admin"
      ? (endPoint = "/admin/profile-pic")
      : role === "Lawyer"
      ? (endPoint = "/lawyer/profile-pic")
      : role === "Client"
      ? (endPoint = "/client/profile-pic")
      : (endPoint = "");

    attachTokenWithFormAxios();
    const res = await formAxios.post(endPoint, formData);
    if (res?.data?.res === "success") {
      dispatch({
        type: userConstants.UPDATE_PROFILE_PICTURE_SUCCESS,
      });
      dispatch(fetchPersonalInfo());
      successMessage("Profile picture updated successfully");
      return "success";
    }
  } catch (error) {
    dispatch({
      type: userConstants.UPDATE_PROFILE_PICTURE_FAILURE,
      payload: error.response.data.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const updatePersonalInfo = (role, values) => async (dispatch) => {
  dispatch({
    type: userConstants.UPDATE_PERSONAL_INFO_REQUEST,
  });
  try {
    let endPoint;
    role === "Lawyer"
      ? (endPoint = "/lawyer/personal-information")
      : role === "Client"
      ? (endPoint = "/client/personal-information")
      : role === "SuperAdmin"
      ? (endPoint = "super-admin/personal-information")
      : (endPoint = "");

    attachToken();
    const res = await custAxios.post(endPoint, values);
    if (res?.data?.res === "success") {
      dispatch({
        type: userConstants.UPDATE_PERSONAL_INFO_SUCCESS,
      });
      dispatch(fetchPersonalInfo());
      successMessage("Profile updated successfully");
      return "success";
    }
  } catch (error) {
    dispatch({
      type: userConstants.UPDATE_PERSONAL_INFO_FAILURE,
      payload: error.response.data.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const updateAddressInfo = (role, values) => async (dispatch) => {
  dispatch({
    type: userConstants.UPDATE_PERSONAL_INFO_REQUEST,
  });
  try {
    let endPoint;
    role === "Lawyer"
      ? (endPoint = "/lawyer/address-detail")
      : role === "Client"
      ? (endPoint = "/client/address-detail")
      : (endPoint = "");

    attachToken();
    const res = await custAxios.post(endPoint, values);
    if (res?.data?.res === "success") {
      dispatch({
        type: userConstants.UPDATE_PERSONAL_INFO_SUCCESS,
      });
      dispatch(fetchPersonalInfo());
      successMessage("Profile updated successfully");
      return "success";
    }
  } catch (error) {
    dispatch({
      type: userConstants.UPDATE_PERSONAL_INFO_FAILURE,
      payload: error.response.data.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const changePassword = (role, values) => async (dispatch) => {
  dispatch({
    type: userConstants.UPDATE_PERSONAL_INFO_REQUEST,
  });
  try {
    let endPoint;
    role === "SuperAdmin"
      ? (endPoint = "/super-admin/change-password")
      : role === "Admin"
      ? (endPoint = "/admin/change-password")
      : role === "Lawyer"
      ? (endPoint = "/lawyer/change-password")
      : role === "Client"
      ? (endPoint = "/client/change-password")
      : (endPoint = "");

    attachToken();
    const res = await custAxios.post(endPoint, values);
    if (res?.data?.res === "success") {
      dispatch({
        type: userConstants.UPDATE_PERSONAL_INFO_SUCCESS,
      });
      successMessage("Password updated successfully");
      return "success";
    } else if (res?.data?.res === "error") {
      errorMessage(res?.data.message);
      return "error";
    }
  } catch (error) {
    dispatch({
      type: userConstants.UPDATE_PERSONAL_INFO_FAILURE,
      payload: error.response.data.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const changeEmailNotification = (role, values) => async (dispatch) => {
  dispatch({
    type: userConstants.CHANGE_EMAIL_NOTIFICATION_REQUEST,
  });
  try {
    let endPoint;
    role === "Lawyer"
      ? (endPoint = `/lawyer/email-notifications/${values}`)
      : role === "Client"
      ? (endPoint = `/client/email-notifications/${values}`)
      : (endPoint = "");

    attachToken();
    const res = await custAxios.put(endPoint);

    if (res?.data?.success) {
      dispatch({
        type: userConstants.CHANGE_EMAIL_NOTIFICATION_SUCCESS,
      });
      dispatch(fetchPersonalInfo());
      successMessage(res.data.message);
      return "success";
    }
  } catch (error) {
    dispatch({
      type: userConstants.CHANGE_EMAIL_NOTIFICATION_FAILURE,
      payload: error.response.data.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};
