import custAxios, { attachToken } from "../../services/axiosConfig";
import { errorMessage, successMessage } from "../../globalFunctions";
import { clientConstants } from "../constants/clientConstant";

// ? Practice Actions

export const getClientDashboardCases =
  (status, pagination) => async (dispatch) => {
    dispatch({ type: clientConstants.GET_CLIENT_DASHBOARD_REQUEST });
    attachToken();
    try {
      const { page, per_page } = pagination;
      const res = await custAxios.get(
        `/client/cases/${status}?page=${page}&per_page=${per_page}`
      );
      if (res?.data?.res === "success") {
        dispatch({
          type: clientConstants.GET_CLIENT_DASHBOARD_SUCCESS,
          payload: res?.data.data,
        });
      } else if (res?.data?.res === "error") {
        dispatch({
          type: clientConstants.GET_CLIENT_DASHBOARD_SUCCESS,
          payload: [],
        });
      }

      return res.data;
    } catch (error) {
      dispatch({
        type: clientConstants.GET_CLIENT_DASHBOARD_SUCCESS,
        payload: [],
      });
      dispatch({
        type: clientConstants.GET_CLIENT_DASHBOARD_FAILURE,
        payload: error?.response?.data?.message || "Server Error",
      });
      // errorMessage(error?.response?.data?.message || "Server Error");
    }
  };
export const acceptContract = (data) => async (dispatch) => {
  dispatch({ type: clientConstants.ACCEPT_CONTRACT_REQUEST });

  attachToken();
  try {
    const res = await custAxios.post("/client/contracts/accept-contract", data);
    if (res?.data?.res === "success") {
      dispatch({
        type: clientConstants.ACCEPT_CONTRACT_SUCCESS,
        payload: res?.data,
      });
      successMessage("Contract Approved Sucessfully");
    }
  } catch (error) {
    dispatch({
      type: clientConstants.ACCEPT_CONTRACT_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const getLawyerAvailibility = (id) => async (dispatch) => {
  dispatch({ type: clientConstants.GET_LAWYER_AVAILIBILITY_REQUEST });
  try {
    const res = await custAxios.get(`/client/lawyer/${id}/availability`);
    if (res?.data?.res === "success") {
      dispatch({
        type: clientConstants.GET_LAWYER_AVAILIBILITY_SUCCESS,
        payload: res?.data.data,
      });
    } else {
      dispatch({
        type: clientConstants.GET_LAWYER_AVAILIBILITY_SUCCESS,
        payload: [],
      });
    }

    return res?.data;
  } catch (error) {
    dispatch({
      type: clientConstants.GET_LAWYER_AVAILIBILITY_SUCCESS,
      payload: [],
    });

    dispatch({
      type: clientConstants.GET_LAWYER_AVAILIBILITY_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const getLawyerTimeSlot = (data) => async (dispatch) => {
  dispatch({ type: clientConstants.GET_CLIENT_TIME_SLOT_REQUEST });
  attachToken();
  try {
    const res = await custAxios.post(
      "client/appointments/fetch-time-slots",
      data
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: clientConstants.GET_CLIENT_TIME_SLOT_SUCCESS,
        payload: res?.data.data,
      });
    } else if (res?.data?.res === "error") {
      dispatch({
        type: clientConstants.GET_CLIENT_TIME_SLOT_SUCCESS,
        payload: [],
      });
      dispatch({
        type: clientConstants.GET_CLIENT_TIME_SLOT_FAILURE,
        payload: res?.data?.message || "Server Error",
      });
    }

    return res?.data;
  } catch (error) {
    dispatch({
      type: clientConstants.GET_CLIENT_TIME_SLOT_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const bookAppointment = (data) => async (dispatch) => {
  dispatch({ type: clientConstants.BOOK_APPOINTMENT_REQUEST });
  attachToken();
  try {
    const res = await custAxios.post("client/appointments/book", data);
    if (res?.data?.res === "success") {
      dispatch({
        type: clientConstants.BOOK_APPOINTMENT_SUCCESS,
      });
      return res?.data;
    }
  } catch (error) {
    dispatch({
      type: clientConstants.BOOK_APPOINTMENT_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const contractListForClient = (data, pagination) => async (dispatch) => {
  dispatch({ type: clientConstants.CONTRACT_LIST_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get(
      `client/contracts/list/${data}?page=${pagination.page}&per_page=${pagination.per_page}`
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: clientConstants.CONTRACT_LIST_SUCCESS,
        payload: res?.data,
      });

      return res.data;
    }

    if (res?.data?.res === "error") {
      dispatch({
        type: clientConstants.CONTRACT_LIST_SUCCESS,
        payload: { ...res.data, contracts: [] },
      });

      return res.data;
    }

    dispatch({
      type: clientConstants.CONTRACT_LIST_FAILURE,
      payload: res?.data?.data?.message || "Server Error",
    });
  } catch (error) {
    dispatch({
      type: clientConstants.CONTRACT_LIST_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const contractByIdForClient = (id) => async (dispatch) => {
  dispatch({ type: clientConstants.CONTRACT_BY_ID_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get(`client/contracts/show/${id}`);
    if (res?.data?.res === "success") {
      dispatch({
        type: clientConstants.CONTRACT_BY_ID_SUCCESS,
        payload: res?.data?.contracts,
      });
    }
  } catch (error) {
    dispatch({
      type: clientConstants.CONTRACT_BY_ID_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const paymentOfContract = (data) => async (dispatch) => {
  dispatch({ type: clientConstants.PAYMENT_OF_CONTRACT_REQUEST });

  attachToken();
  try {
    const res = await custAxios.post("client/payment/create-payment", data);
    if (res?.data?.res === "success") {
      dispatch({
        type: clientConstants.PAYMENT_OF_CONTRACT_SUCCESS,
        payload: res?.data,
      });
    }
  } catch (error) {
    dispatch({
      type: clientConstants.PAYMENT_OF_CONTRACT_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const approveContract = (data) => async (dispatch) => {
  dispatch({ type: clientConstants.APPROVE_CONTRACT_REQUEST });

  attachToken();
  try {
    const res = await custAxios.post("client/payment/create-payment", data);
    if (res?.data?.res === "success") {
      dispatch({
        type: clientConstants.APPROVE_CONTRACT_SUCCESS,
        payload: res?.data,
      });
    }
  } catch (error) {
    dispatch({
      type: clientConstants.APPROVE_CONTRACT_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const appointmentListForClient =
  (status, pagination, date = "") =>
  async (dispatch) => {
    dispatch({ type: clientConstants.APPOINTMENT_LIST_REQUEST });
    attachToken();

    try {
      const res = await custAxios.get(
        `client/appointments/list?status=${status}&page=${pagination.page}&per_page=${pagination.per_page}&date=${date}`
      );
      if (res?.data?.res === "success") {
        dispatch({
          type: clientConstants.APPOINTMENT_LIST_SUCCESS,
          payload: res?.data?.data,
        });
      } else if (res?.data?.res === "error") {
        dispatch({
          type: clientConstants.APPOINTMENT_LIST_SUCCESS,
          payload: [],
        });
      }
      return res.data;
    } catch (error) {
      dispatch({
        type: clientConstants.APPOINTMENT_LIST_FAILURE,
        payload: error?.response?.data?.message || "Server Error",
      });
      errorMessage(error?.response?.data?.message || "Server Error");
    }
  };

export const fetchMilestoneStages = (id) => async (dispatch) => {
  dispatch({ type: clientConstants.VIEW_MILESTONE_STAGES_REQUEST });

  attachToken();
  try {
    const res = await custAxios.get(
      `client/milestones/stages-with-steps/${id}`
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: clientConstants.VIEW_MILESTONE_STAGES_SUCCESS,
        payload: res?.data?.data,
      });
    }
    return res?.data?.data;
  } catch (error) {
    dispatch({
      type: clientConstants.VIEW_MILESTONE_STAGES_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};
export const fetchMilestoneSteps = (id) => async (dispatch) => {
  dispatch({ type: clientConstants.VIEW_MILESTONE_STEPS_REQUEST });

  attachToken();
  try {
    const res = await custAxios.get(
      `client/milestones/get-milestone-steps/${id}`
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: clientConstants.VIEW_MILESTONE_STEPS_SUCCESS,
        payload: res?.data?.data,
      });
    }
    return res?.data?.data;
  } catch (error) {
    dispatch({
      type: clientConstants.VIEW_MILESTONE_STEPS_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const isAbleToChat = (id) => async (dispatch) => {
  dispatch({ type: clientConstants.IS_ABLE_TO_CHAT_REQUEST });
  try {
    attachToken();
    const res = await custAxios.get(`client/chat/case-availability/${id}`);
    if (res?.data?.res) {
      dispatch({
        type: clientConstants.IS_ABLE_TO_CHAT_SUCCESS,
        payload: res?.data,
      });
    }
    return res?.data;
  } catch (error) {
    dispatch({
      type: clientConstants.IS_ABLE_TO_CHAT_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};
