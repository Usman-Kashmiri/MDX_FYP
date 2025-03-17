import custAxios, {
  attachToken,
  attachTokenWithFormAxios,
  formAxios,
} from "../../services/axiosConfig";
import {
  errorMessage,
  successMessage,
  warningMessage,
} from "../../globalFunctions";
import { lawyerConstants } from "../constants/lawyerConstants";

export const addLawyerAvailibilityTime = (data) => async (dispatch) => {
  dispatch({ type: lawyerConstants.LAWYER_AVAILIBILITY_REQUEST });
  try {
    const res = await custAxios.post("lawyer/lawyer-availability/create", data);
    if (res?.data?.res === "success") {
      dispatch({
        type: lawyerConstants.LAWYER_AVAILIBILITY_SUCCESS,
        payload: res?.data?.data,
      });
      getLawyerAvailibilityTime();
      successMessage("Availibilty Time Updated");
    } else if (res?.data?.res === "error") {
      dispatch({
        type: lawyerConstants.LAWYER_AVAILIBILITY_FAILURE,
        payload: res?.data?.message,
      });
      errorMessage(res?.data?.message);
    }
    return res?.data;
  } catch (error) {
    dispatch({
      type: lawyerConstants.LAWYER_AVAILIBILITY_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const updateLawyerAvailibilityTime = (data) => async (dispatch) => {
  dispatch({ type: lawyerConstants.UPDATE_LAWYER_AVAILIBILITY_REQUEST });
  try {
    const res = await custAxios.post(
      "lawyer/lawyer-availability/update-multiple",
      data
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: lawyerConstants.UPDATE_LAWYER_AVAILIBILITY_SUCCESS_LAWYER_AVAILIBILITY_SUCCESS,
        payload: res?.data.data,
      });
      getLawyerAvailibilityTime();
    }
  } catch (error) {
    dispatch({
      type: lawyerConstants.UPDATE_LAWYER_AVAILIBILITY_FAILURE_LAWYER_AVAILIBILITY_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};
export const getLawyerAvailibilityTime = () => async (dispatch) => {
  dispatch({ type: lawyerConstants.GET_LAWYER_AVAILIBILITY_REQUEST });
  try {
    const res = await custAxios.get("lawyer/lawyer-availability/list");
    if (res?.data?.res === "success") {
      dispatch({
        type: lawyerConstants.GET_LAWYER_AVAILIBILITY_SUCCESS,
        payload: res?.data.data,
      });
      return res?.data;
    }
  } catch (error) {
    dispatch({
      type: lawyerConstants.GET_LAWYER_AVAILIBILITY_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const getLawyerCase = (param, pagination) => async (dispatch) => {
  dispatch({ type: lawyerConstants.GET_LAWYER_CASES_REQUEST });
  attachToken();
  try {
    const { page, per_page } = pagination;
    const res = await custAxios.get(
      `lawyer/cases/list/${param}?page=${page}&per_page=${per_page}`
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: lawyerConstants.GET_LAWYER_CASES_SUCCESS,
        payload: res?.data?.data,
      });
      return res.data;
    } else if (res?.data?.res === "error") {
      dispatch({
        type: lawyerConstants.GET_LAWYER_CASES_SUCCESS,
        payload: [],
      });
      dispatch({
        type: lawyerConstants.GET_LAWYER_CASES_FAILURE,
        payload: res?.data?.message,
      });
    }
  } catch (error) {
    dispatch({
      type: lawyerConstants.GET_LAWYER_CASES_SUCCESS,
      payload: [],
    });
    dispatch({
      type: lawyerConstants.GET_LAWYER_CASES_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    // errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const getTimeSlot = () => async (dispatch) => {
  dispatch({ type: lawyerConstants.GET_TIME_SLOT_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get("lawyer/time-slot/list");
    if (res?.data?.res === "success") {
      dispatch({
        type: lawyerConstants.GET_TIME_SLOT_SUCCESS,
        payload: res?.data.data,
      });
    }
  } catch (error) {
    dispatch({
      type: lawyerConstants.GET_TIME_SLOT_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const generateTimeSlot = () => async (dispatch) => {
  dispatch({ type: lawyerConstants.GENERATE_TIME_SLOT_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get("lawyer/time-slot/generate");
    if (res?.data?.res === "success") {
      dispatch({
        type: lawyerConstants.GENERATE_TIME_SLOT_SUCCESS,
        payload: res?.data.data,
      });
      dispatch(getTimeSlot());
    }
  } catch (error) {
    dispatch({
      type: lawyerConstants.GENERATE_TIME_SLOT_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const contractCreation = (data) => async (dispatch) => {
  dispatch({ type: lawyerConstants.CONTRACT_CREATION_REQUEST });
  attachTokenWithFormAxios();
  try {
    const res = await formAxios.post("lawyer/contracts/create", data);
    if (res?.data?.res === "success") {
      dispatch({
        type: lawyerConstants.CONTRACT_CREATION_SUCCESS,
        payload: res?.data?.res,
      });
      successMessage("Contract Created Successfully");
      return "success";
    } else if (res?.data?.res === "error" || res?.data?.res === "warning") {
      dispatch({
        type: lawyerConstants.CONTRACT_CREATION_FAILURE,
        payload: res?.data?.message || "Server Error",
      });
      errorMessage(res?.data?.message);
    }
  } catch (error) {
    dispatch({
      type: lawyerConstants.CONTRACT_CREATION_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const clientList = () => async (dispatch) => {
  dispatch({ type: lawyerConstants.CLIENT_LIST_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get("lawyer/contracts/client-list");
    if (res?.data?.res === "success") {
      dispatch({
        type: lawyerConstants.CLIENT_LIST_SUCCESS,
        payload: res?.data?.clients,
      });
    }
    if (res?.data?.res === "warning") {
      dispatch({
        type: lawyerConstants.CLIENT_LIST_SUCCESS,
        payload: [],
      });
    }
  } catch (error) {
    dispatch({
      type: lawyerConstants.CLIENT_LIST_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};
export const contractList = (status, pagination) => async (dispatch) => {
  dispatch({ type: lawyerConstants.CONTRACT_LIST_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get(
      `lawyer/contracts/list/${status}?page=${pagination.page}&per_page=${pagination.per_page}`
    );

    if (res.data.res === "error") {
      dispatch({
        type: lawyerConstants.CONTRACT_LIST_SUCCESS,
        payload: { ...res.data, contracts: [] },
      });

      return res.data;
    }

    if (res.data.res === "success") {
      dispatch({
        type: lawyerConstants.CONTRACT_LIST_SUCCESS,
        payload: res?.data,
      });
      return res.data;
    }
  } catch (error) {
    dispatch({
      type: lawyerConstants.CONTRACT_LIST_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message);
  }
};

export const contractById = (id) => async (dispatch) => {
  dispatch({ type: lawyerConstants.CONTRACT_BY_ID_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get(`lawyer/contracts/show/${id}`);
    if (res?.data?.res === "success") {
      dispatch({
        type: lawyerConstants.CONTRACT_BY_ID_SUCCESS,
        payload: res?.data?.contracts,
      });
    }
  } catch (error) {
    errorMessage(error?.response?.data?.message || "Server Error");
    dispatch({
      type: lawyerConstants.CONTRACT_BY_ID_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
  }
};
export const requestContract = (id) => async (dispatch) => {
  dispatch({ type: lawyerConstants.REQUEST_CONTRACT_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get(`lawyer/contracts/complete-request/${id}`);

    if (res?.data?.res === "success") {
      dispatch({
        type: lawyerConstants.REQUEST_CONTRACT_SUCCESS,
        payload: res?.data,
      });
      successMessage(res?.data?.message);
      return
    } else if (res?.data?.res === "warning") { 
      dispatch({
        type: lawyerConstants.REQUEST_CONTRACT_FAILURE,
      });
      warningMessage(res?.data?.message || "Server Error");
    }

  } catch (error) {
    console.log('requestContract ', error);
    dispatch({
      type: lawyerConstants.REQUEST_CONTRACT_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    }); 
  }
};
export const appointmentList =
  (status, pagination, date = "") =>
    async (dispatch) => {
      dispatch({ type: lawyerConstants.APPOINTMENT_LIST_REQUEST });
      attachToken();
      try {
        const res = await custAxios.get(
          `lawyer/appointments/list?status=${status}&page=${pagination.page}&per_page=${pagination.per_page}&date=${date}`
        );
        if (res?.data?.res === "success") {
          dispatch({
            type: lawyerConstants.APPOINTMENT_LIST_SUCCESS,
            payload: res?.data?.data,
          });
        } else if (res?.data?.res === "error") {
          dispatch({
            type: lawyerConstants.APPOINTMENT_LIST_SUCCESS,
            payload: [],
          });
          dispatch({
            type: lawyerConstants.APPOINTMENT_LIST_FAILURE,
            payload: res?.data?.message,
          });
        }

        return res.data;
      } catch (error) {
        dispatch({
          type: lawyerConstants.APPOINTMENT_LIST_FAILURE,
          payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message || "Server Error");
        errorMessage(error?.response?.data?.message || "Server Error");
      }
    };
export const transactionList = (dates) => async (dispatch) => {
  dispatch({ type: lawyerConstants.TRANSACTION_LIST_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get(
      dates
        ? `lawyer/transactions/list?start_date=${dates?.startDate}&end_date=${dates?.endDate}`
        : "lawyer/transactions/list"
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: lawyerConstants.TRANSACTION_LIST_SUCCESS,
        payload: res?.data?.data,
      });
    } else if (res?.data?.res === "error") {
      dispatch({
        type: lawyerConstants.TRANSACTION_LIST_SUCCESS,
        payload: [],
      });
      dispatch({
        type: lawyerConstants.TRANSACTION_LIST_FAILURE,
        payload: res?.data?.message,
      });
    }
    return res?.data;
  } catch (error) {
    dispatch({
      type: lawyerConstants.TRANSACTION_LIST_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};
export const transactionById = (id) => async (dispatch) => {
  dispatch({ type: lawyerConstants.TRANSACTION_BY_ID_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get(`lawyer/transactions/show/${id}`);
    if (res?.data?.res === "success") {
      dispatch({
        type: lawyerConstants.TRANSACTION_BY_ID_SUCCESS,
        payload: res?.data?.data,
      });
    } else if (res?.data?.res === "error") {
      dispatch({
        type: lawyerConstants.TRANSACTION_BY_ID_SUCCESS,
        payload: {},
      });
    }
  } catch (error) {
    dispatch({
      type: lawyerConstants.TRANSACTION_BY_ID_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};
export const withDrawRequestList = () => async (dispatch) => {
  dispatch({ type: lawyerConstants.WITHDRAW_REQUEST_LIST_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get(`lawyer/withdraw/list`);
    if (res?.data.status === "success") {
      dispatch({
        type: lawyerConstants.WITHDRAW_REQUEST_LIST_SUCCESS,
        payload: res?.data,
      });
      return res?.data;
    } else if (res?.data.status === "error") {
      dispatch({
        type: lawyerConstants.WITHDRAW_REQUEST_LIST_SUCCESS,
        payload: [],
      });
      return res?.data;
    }
  } catch (error) {
    dispatch({
      type: lawyerConstants.WITHDRAW_REQUEST_LIST_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    // errorMessage(error?.response?.data?.message || "Server Error");errorMessage(error?.response?.data?.message || "Server Error");
  }
};
export const withDrawRequest = (amount) => async (dispatch) => {
  dispatch({ type: lawyerConstants.WITHDRAW_REQUEST_REQUEST });
  attachToken();
  try {
    const res = await custAxios.post(`lawyer/withdraw/request`, amount);
    if (res?.data?.res === "success") {
      dispatch({
        type: lawyerConstants.WITHDRAW_REQUEST_SUCCESS,
        payload: res?.data?.data,
      });
    }
    return res?.data;
  } catch (error) {
    dispatch({
      type: lawyerConstants.WITHDRAW_REQUEST_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};
export const updateIban = (data) => async (dispatch) => {
  dispatch({ type: lawyerConstants.UPDATE_IBAN_REQUEST });
  attachToken();
  try {
    const res = await custAxios.post(`lawyer/withdraw/update-iban`, data);
    if (res?.data?.res === "success") {
      dispatch({
        type: lawyerConstants.UPDATE_IBAN_SUCCESS,
        payload: res?.data?.data,
      });
      return res?.data;
    } else if (res?.data?.res === "error") {
      dispatch({
        type: lawyerConstants.UPDATE_IBAN_FAILURE,
        payload: res?.data?.message,
      });
    }
    return res?.data;
  } catch (error) {
    dispatch({
      type: lawyerConstants.UPDATE_IBAN_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};
export const createMilestoneStage = (data) => async (dispatch) => {
  dispatch({ type: lawyerConstants.CREATE_MILESTONE_STAGE_REQUEST });
  attachToken();
  try {
    const res = await custAxios.post(
      `lawyer/milestones/create-milestone-stage`,
      data
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: lawyerConstants.CREATE_MILESTONE_STAGE_SUCCESS,
        payload: res?.data?.data,
      });
    }
    return res?.data;
  } catch (error) {
    dispatch({
      type: lawyerConstants.CREATE_MILESTONE_STAGE_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};
export const getMilestoneStageWithSteps = (id) => async (dispatch) => {
  dispatch({ type: lawyerConstants.GET_MILESTONE_STAGE_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get(
      `lawyer/milestones/stages-with-steps/${id}`
    );
    // console.log(res);
    // if (res?.data?.res === "success") {
    if (res?.status === 200) {
      dispatch({
        type: lawyerConstants.GET_MILESTONE_STAGE_SUCCESS,
        payload: res?.data?.data,
      });
    }
    return res?.data;
  } catch (error) {
    dispatch({
      type: lawyerConstants.GET_MILESTONE_STAGE_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};
export const createMilestoneStep = (data) => async (dispatch) => {
  dispatch({ type: lawyerConstants.GET_MILESTONE_STEP_REQUEST });
  attachToken();
  try {
    const res = await custAxios.post(
      `lawyer/milestones/create-milestone-step`,
      data
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: lawyerConstants.GET_MILESTONE_STEP_SUCCESS,
        payload: res?.data?.data,
      });
    }
    return res?.data;
  } catch (error) {
    dispatch({
      type: lawyerConstants.GET_MILESTONE_STEP_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};
export const getMilestoneStepsByStageId = (id) => async (dispatch) => {
  dispatch({ type: lawyerConstants.GET_MILESTONE_STEP_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get(
      `lawyer/milestones/get-milestone-steps/${id}`
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: lawyerConstants.GET_MILESTONE_STEP_SUCCESS,
        payload: res?.data?.data,
      });
    }
    return res?.data;
  } catch (error) {
    dispatch({
      type: lawyerConstants.GET_MILESTONE_STEP_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};
