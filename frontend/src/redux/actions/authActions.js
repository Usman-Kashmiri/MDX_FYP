import { authConstants } from "../constants/authConstants";
import custAxios, { attachToken } from "../../services/axiosConfig";
import {
  errorMessage,
  successMessage,
  warningMessage,
} from "../../globalFunctions";

export const signup = (values) => async (dispatch) => {
  dispatch({
    type: authConstants.SIGNUP_REQUEST,
  });
  try {
    const res = await custAxios.post("/auth/register", values);
    if (res?.data?.res === "success") {
      dispatch({
        type: authConstants.SIGNUP_SUCCESS,
      });
      successMessage(res?.data.message);
      return "success";
    }
  } catch (error) {
    dispatch({
      type: authConstants.SIGNUP_FAILURE,
      payload: error.response.data.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const register_with = (values) => async (dispatch) => {
  dispatch({
    type: authConstants.REGISTER_WITH_REQUEST,
  });
  try {
    const res = await custAxios.post("auth/register-with", values);
    if (res?.data?.res === "success") {
      dispatch({
        type: authConstants.REGISTER_WITH_SUCCESS,
      });
      successMessage(res?.data.message);
      return "success";
    }
  } catch (error) {
    dispatch({
      type: authConstants.REGISTER_WITH_FAILURE,
      payload: error.response.data.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const login_with = (values) => async (dispatch) => {
  dispatch({
    type: authConstants.LOGIN_WITH_REQUEST,
  });
  try {
    const res = await custAxios.post("/auth/login-with", values);
    if (res?.data?.res === "success") {
      localStorage.setItem("token", res?.data.token.access_token);
      localStorage.setItem("user", JSON.stringify(res?.data.user));

      // Storing token expiry time in localStorage
      const currentTime = new Date();

      localStorage.setItem(
        "beforeTokenExpires",
        new Date(currentTime.getTime() + 50 * (60 * 23) * 1000)
      );
      localStorage.setItem(
        "afterTokenExpires",
        new Date(currentTime.getTime() + 70 * (60 * 23) * 1000)
      );

      await dispatch({
        type: authConstants.LOGIN_WITH_SUCCESS,
        payload: res?.data,
      });

      successMessage("Login Successful");
      return res?.data;
    }
  } catch (error) {
    dispatch({
      type: authConstants.LOGIN_WITH_FAILURE,
      payload: error.response.data.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const login = (values) => async (dispatch) => {
  dispatch({
    type: authConstants.LOGIN_REQUEST,
  });
  try {
    const res = await custAxios.post("/auth/login", values);
    if (res?.data?.res === "success") {
      if (values.remember_me === true) {
        localStorage.setItem("email", values.email);
        localStorage.setItem("password", window.btoa(values.password));
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }

      localStorage.setItem("token", res?.data.token.access_token);
      localStorage.setItem("user", JSON.stringify(res?.data.user));

      // Storing token expiry time in localStorage
      const currentTime = new Date();

      localStorage.setItem(
        "beforeTokenExpires",
        new Date(currentTime.getTime() + 1 * (60 * 23) * 1000)
      );
      localStorage.setItem(
        "afterTokenExpires",
        new Date(currentTime.getTime() + 61 * (60 * 23) * 1000)
      );

      await dispatch({
        type: authConstants.LOGIN_SUCCESS,
        payload: res?.data,
      });
      successMessage("Login Successful");
      return res?.data;
    } else if (res?.data?.res === "error") {
      await dispatch({
        type: authConstants.LOGIN_FAILURE,
        payload: res?.data.message,
      });
      errorMessage(res?.data.message);
      return "not verified";
    } else if (res?.data?.res === "warning") {
      await dispatch({
        type: authConstants.LOGIN_FAILURE,
        payload: res?.data.message,
      });
      errorMessage(res?.data.message);
      return "failure";
    }
  } catch (error) {
    dispatch({
      type: authConstants.LOGIN_FAILURE,
      payload: error.response.data.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const verifyEmail = (values) => async (dispatch) => {
  dispatch({
    type: authConstants.VERIFY_EMAIL_REQUEST,
  });
  try {
    const res = await custAxios.post("/auth/verify-email", values);
    if (res?.data?.res === "success") {
      localStorage.setItem("token", res?.data.token.access_token);
      localStorage.setItem("user", JSON.stringify(res?.data.user));

      localStorage.setItem("token", res?.data.token.access_token);
      localStorage.setItem("user", JSON.stringify(res?.data.user));

      // ? Storing token expiry time in localStorage
      const currentTime = new Date();

      localStorage.setItem(
        "beforeTokenExpires",
        new Date(currentTime.getTime() + 30 * (60 * 23) * 1000)
      );
      localStorage.setItem(
        "afterTokenExpires",
        new Date(currentTime.getTime() + 61 * (60 * 23) * 1000)
      );
      dispatch({
        type: authConstants.VERIFY_EMAIL_SUCCESS,
        payload: res?.data,
      });
      successMessage("Email Verified Successful");
    } else if (res?.data?.res === "warning") {
      dispatch({
        type: authConstants.VERIFY_EMAIL_FAILURE,
        payload: res?.data.message || "Server Error",
      });
      warningMessage(res?.data.message);
    } else if (res?.data?.res === "error") {
      dispatch({
        type: authConstants.VERIFY_EMAIL_FAILURE,
        payload: res?.data.message || "Server Error",
      });
      warningMessage(res?.data.message);
    }

    return res?.data;
  } catch (error) {
    dispatch({
      type: authConstants.VERIFY_EMAIL_FAILURE,
      payload: error.response.data.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
    if (error.response.data.message.includes("Please generate new token")) {
      return "resend token";
    }
  }
};

export const resendToken = () => async (dispatch) => {
  dispatch({
    type: authConstants.RESEND_TOKEN_REQUEST,
  });
  try {
    attachToken();
    const res = await custAxios.post("/refresh-token");
    if (res) {
      localStorage.setItem("token", res?.data.token.access_token);
      dispatch({
        type: authConstants.RESEND_TOKEN_SUCCESS,
      });
      successMessage("Verification Token Resent");
      return true;
    }
  } catch (error) {
    dispatch({
      type: authConstants.RESEND_TOKEN_FAILURE,
      payload: error.response.data.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const forgotPassword = (values) => async (dispatch) => {
  dispatch({
    type: authConstants.REQUEST_VERIFICATION_TOKEN_REQUEST,
  });
  try {
    attachToken();
    const res = await custAxios.post("/auth/reset-password", values);
    if (res?.data?.res === "success") {
      dispatch({
        type: authConstants.REQUEST_VERIFICATION_TOKEN_SUCCESS,
      });
      successMessage(res?.data.message);
      return "success";
    }
  } catch (error) {
    dispatch({
      type: authConstants.REQUEST_VERIFICATION_TOKEN_FAILURE,
      payload: error.response.data.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const requestVerificationToken = (email) => async (dispatch) => {
  dispatch({
    type: authConstants.REQUEST_VERIFICATION_TOKEN_REQUEST,
  });
  try {
    attachToken();
    const res = await custAxios.post("/auth/resend-verify-email", email);
    if (res?.data?.res === "success") {
      dispatch({
        type: authConstants.REQUEST_VERIFICATION_TOKEN_SUCCESS,
      });
      successMessage(res?.data.message);
      return "token sent";
    } else {
      dispatch({
        type: authConstants.REQUEST_VERIFICATION_TOKEN_FAILURE,
        payload: res?.data.message || "Server Error",
      });
      errorMessage(res?.data.message);
      return "email verified";
    }
  } catch (error) {
    dispatch({
      type: authConstants.REQUEST_VERIFICATION_TOKEN_FAILURE,
      payload: error.response.data.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const resetPassword = (values) => async (dispatch) => {
  dispatch({
    type: authConstants.RESET_PASSWORD_REQUEST,
  });
  try {
    attachToken();
    const res = await custAxios.post("/auth/forgot-password", values);
    if (res?.data?.res === "success") {
      successMessage(res?.data.message);
      await dispatch(login({ email: values.email, password: values.password }));
      return "success";
    }
  } catch (error) {
    dispatch({
      type: authConstants.RESET_PASSWORD_FAILURE,
      payload: error.response.data.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: authConstants.CLEAR_ERRORS,
  });
};

export const logout = () => async (dispatch) => {
  dispatch({
    type: authConstants.LOGOUT_REQUEST,
  });
  try {
    attachToken();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("beforeTokenExpires");
    localStorage.removeItem("afterTokenExpires");

    const res = await custAxios.get("/auth/logout");

    if (res?.data?.res === "success") {
      await dispatch({
        type: authConstants.LOGOUT_SUCCESS,
      });
      // successMessage("You have been logout");
      return "success";
    }
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("beforeTokenExpires");
    localStorage.removeItem("afterTokenExpires");

    dispatch({
      type: authConstants.LOGOUT_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    // errorMessage(error?.response?.data?.message || "Server Error");errorMessage(error?.response?.data?.message || "Server Error");
  }
};
