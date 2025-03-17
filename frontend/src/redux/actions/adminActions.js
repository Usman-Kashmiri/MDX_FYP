import custAxios, {
  attachToken,
  attachTokenWithFormAxios,
  formAxios,
} from "../../services/axiosConfig";
import { errorMessage, successMessage } from "../../globalFunctions";
import { adminConstants } from "../constants/adminContants";

// ? Practice Actions
export const fetchPracticeList = () => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }

  dispatch({ type: adminConstants.FETCH_PRACTICE_REQUEST });
  try {
    attachToken();
    const res = await custAxios.get(`/${role}/area-expertise/list`);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.FETCH_PRACTICE_SUCCESS,
        payload: res?.data.data,
      });
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.FETCH_PRACTICE_SUCCESS,
        payload: [],
      });
      dispatch({
        type: adminConstants.FETCH_PRACTICE_FAILURE,
        payload: res?.data.message,
      });
    }

    return res?.data?.data;
  } catch (error) {
    dispatch({
      type: adminConstants.FETCH_PRACTICE_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const addPractice = (values) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.ADD_PRACTICE_REQUEST });
  try {
    attachToken();
    const res = await custAxios.post(`/${role}/area-expertise/create`, values);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.ADD_PRACTICE_SUCCESS,
      });
      dispatch(fetchPracticeList());
      successMessage("Practice added successfully");
      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.ADD_PRACTICE_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.ADD_PRACTICE_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const updatePractice = (id, values) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.UPDATE_PRACTICE_REQUEST });
  try {
    attachToken();
    const res = await custAxios.post(
      `/${role}/area-expertise/update/${id}`,
      values
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.UPDATE_PRACTICE_SUCCESS,
      });
      dispatch(fetchPracticeList());
      successMessage("Practice updated successfully");
      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.UPDATE_PRACTICE_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.UPDATE_PRACTICE_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const deletePractice = (id) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.DELETE_PRACTICE_REQUEST });
  try {
    attachToken();
    const res = await custAxios.get(`/${role}/area-expertise/destroy/${id}`);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.DELETE_PRACTICE_SUCCESS,
      });
      dispatch(fetchPracticeList());
      successMessage("Practice Deleted successfully");
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.DELETE_PRACTICE_FAILURE,
        payload: res?.data?.message,
      });
      errorMessage(res?.data?.message);
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.DELETE_PRACTICE_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

// ? Jurisdictions Actions
export const fetchJurisdictionList = () => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.FETCH_JURISDICTIONS_REQUEST });
  try {
    attachToken();
    const res = await custAxios.get(`/${role}/jurisdiction/list`);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.FETCH_JURISDICTIONS_SUCCESS,
        payload: res?.data.data,
      });
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.FETCH_JURISDICTIONS_SUCCESS,
        payload: [],
      });
      dispatch({
        type: adminConstants.FETCH_JURISDICTIONS_FAILURE,
        payload: res?.data.message,
      });
    }

    return res?.data?.data;
  } catch (error) {
    dispatch({
      type: adminConstants.FETCH_JURISDICTIONS_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const addJurisdiction = (values) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.ADD_JURISDICTION_REQUEST });
  try {
    attachToken();
    const res = await custAxios.post(`/${role}/jurisdiction/create`, values);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.ADD_JURISDICTION_SUCCESS,
      });
      dispatch(fetchJurisdictionList());
      successMessage("Jurisdiction added successfully");
      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.ADD_JURISDICTION_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.ADD_JURISDICTION_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const updateJurisdiction = (id, values) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.UPDATE_JURISDICTION_REQUEST });
  try {
    attachToken();
    const res = await custAxios.post(
      `/${role}/jurisdiction/update/${id}`,
      values
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.UPDATE_JURISDICTION_SUCCESS,
      });
      dispatch(fetchJurisdictionList());
      successMessage("Jurisdiction updated successfully");
      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.UPDATE_JURISDICTION_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.UPDATE_JURISDICTION_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const deleteJurisdiction = (id) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.DELETE_JURISDICTION_REQUEST });
  try {
    attachToken();
    const res = await custAxios.get(`/${role}/jurisdiction/destroy/${id}`);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.DELETE_JURISDICTION_SUCCESS,
      });
      dispatch(fetchJurisdictionList());
      successMessage("Jurisdiction Deleted successfully");
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.DELETE_JURISDICTION_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.DELETE_JURISDICTION_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

// ? Moderators Actions
export const fetchModeratorList = (pagination) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.FETCH_MODERATORS_REQUEST });
  try {
    const { page, per_page } = pagination;
    attachToken();
    const res = await custAxios.get(
      `/${role}/admin/list?page=${page}&per_page=${per_page}`
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.FETCH_MODERATORS_SUCCESS,
        payload: res?.data.data,
      });
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.FETCH_MODERATORS_SUCCESS,
        payload: [],
      });
      dispatch({
        type: adminConstants.FETCH_MODERATORS_FAILURE,
        payload: res?.data.message,
      });
    }

    return res?.data;
  } catch (error) {
    dispatch({
      type: adminConstants.FETCH_MODERATORS_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const addModerator = (values) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.ADD_MODERATOR_REQUEST });
  try {
    attachToken();
    const res = await custAxios.post(`/${role}/admin/create`, values);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.ADD_MODERATOR_SUCCESS,
      });
      dispatch(
        fetchModeratorList({
          page: 1,
          per_page: 8,
        })
      );
      successMessage("Moderator added successfully");
      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.ADD_MODERATOR_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.ADD_MODERATOR_FAILURE,
      payload: error?.response?.data || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Internal server error");
  }
};

export const updateModerator = (id, values) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.UPDATE_MODERATOR_REQUEST });
  try {
    attachToken();
    const res = await custAxios.post(`/${role}/admin/update/${id}`, values);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.UPDATE_MODERATOR_SUCCESS,
      });
      dispatch(
        fetchModeratorList({
          page: 1,
          per_page: 8,
        })
      );
      successMessage("Moderator updated successfully");
      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.UPDATE_MODERATOR_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.UPDATE_MODERATOR_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const deleteModerator = (id) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.DELETE_MODERATOR_REQUEST });
  try {
    attachToken();
    const res = await custAxios.get(`/${role}/admin/destroy/${id}`);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.DELETE_MODERATOR_SUCCESS,
      });
      dispatch(
        fetchModeratorList({
          page: 1,
          per_page: 8,
        })
      );
      successMessage("Moderator Deleted successfully");
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.DELETE_MODERATOR_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.DELETE_MODERATOR_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const fetchDashboard = () => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.GET_DASHBOARD_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get(`/${role}/dashboard`);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.GET_DASHBOARD_SUCCESS,
        payload: res?.data.data,
      });
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.GET_DASHBOARD_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.GET_DASHBOARD_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

// ? Lawyers Actions
export const fetchLawyerList = (pagination) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.FETCH_LAWYERS_REQUEST });
  try {
    const { page, per_page } = pagination;
    attachToken();
    const res = await custAxios.get(
      `/${role}/lawyer/list?page=${page}&per_page=${per_page}`
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.FETCH_LAWYERS_SUCCESS,
        payload: res?.data.data,
      });
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.FETCH_LAWYERS_SUCCESS,
        payload: [],
      });
      dispatch({
        type: adminConstants.FETCH_LAWYERS_FAILURE,
        payload: res?.data.message,
      });
    }

    return res?.data;
  } catch (error) {
    dispatch({
      type: adminConstants.FETCH_LAWYERS_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const addLawyer = (values) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.ADD_LAWYER_REQUEST });
  try {
    attachToken();
    const res = await custAxios.post(`/${role}/lawyer/create`, values);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.ADD_LAWYER_SUCCESS,
      });
      dispatch(
        fetchLawyerList({
          page: 1,
          per_page: 8,
        })
      );
      successMessage("Lawyer added successfully");
      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.ADD_LAWYER_FAILURE,
        payload: res?.data?.message,
      });
      errorMessage(res?.data?.message);
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.ADD_LAWYER_FAILURE,
      payload: error?.response?.data || "Server Error",
    });
    errorMessage("Internal server error");
  }
};

export const updateLawyer = (id, values) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.UPDATE_LAWYER_REQUEST });
  try {
    attachToken();
    const res = await custAxios.post(`/${role}/lawyer/update/${id}`, values);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.UPDATE_LAWYER_SUCCESS,
      });
      dispatch(
        fetchLawyerList({
          page: 1,
          per_page: 8,
        })
      );
      successMessage("Lawyer updated successfully");
      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.UPDATE_LAWYER_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.UPDATE_LAWYER_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const deleteLawyer = (id) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.DELETE_LAWYER_REQUEST });
  try {
    attachToken();
    const res = await custAxios.get(`/${role}/lawyer/destroy/${id}`);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.DELETE_LAWYER_SUCCESS,
      });
      dispatch(
        fetchLawyerList({
          page: 1,
          per_page: 8,
        })
      );
      successMessage("Lawyer Deleted successfully");
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.DELETE_LAWYER_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.DELETE_LAWYER_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

// ? Clients Actions
export const fetchClientList = (pagination) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.FETCH_CLIENTS_REQUEST });
  try {
    const { page, per_page } = pagination;
    attachToken();
    const res = await custAxios.get(
      `/${role}/client/list?page=${page}&per_page=${per_page}`
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.FETCH_CLIENTS_SUCCESS,
        payload: res?.data.data,
      });
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.FETCH_CLIENTS_SUCCESS,
        payload: [],
      });
      dispatch({
        type: adminConstants.FETCH_CLIENTS_FAILURE,
        payload: res?.data.message,
      });
    }

    return res?.data;
  } catch (error) {
    dispatch({
      type: adminConstants.FETCH_CLIENTS_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const addClient = (values) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.ADD_CLIENT_REQUEST });
  try {
    attachToken();
    const res = await custAxios.post(`/${role}/client/create`, values);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.ADD_CLIENT_SUCCESS,
      });
      dispatch(
        fetchClientList({
          page: 1,
          per_page: 8,
        })
      );
      successMessage("Client added successfully");
      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.ADD_CLIENT_FAILURE,
        payload: res?.data?.message,
      });
      errorMessage(res?.data?.message);
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.ADD_CLIENT_FAILURE,
      payload: error?.response?.data || "Server Error",
    });
    errorMessage("Internal server error");
  }
};

export const updateClient = (id, values) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.UPDATE_CLIENT_REQUEST });
  try {
    attachToken();
    const res = await custAxios.post(`/${role}/client/update/${id}`, values);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.UPDATE_CLIENT_SUCCESS,
      });
      dispatch(
        fetchClientList({
          page: 1,
          per_page: 8,
        })
      );
      successMessage("Client updated successfully");
      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.UPDATE_CLIENT_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.UPDATE_CLIENT_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const deleteClient = (id) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.DELETE_CLIENT_REQUEST });
  try {
    attachToken();
    const res = await custAxios.get(`/${role}/client/destroy/${id}`);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.DELETE_CLIENT_SUCCESS,
      });
      dispatch(
        fetchClientList({
          page: 1,
          per_page: 8,
        })
      );
      successMessage("Client Deleted successfully");
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.DELETE_CLIENT_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.DELETE_CLIENT_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const contractListForAdmin = (data, pagination) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.CONTRACT_LIST_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get(
      `/${role}/contracts/list/${data}?page=${pagination.page}&per_page=${pagination.per_page}`
    );
    if (res.data.res === "success") {
      dispatch({
        type: adminConstants.CONTRACT_LIST_SUCCESS,
        payload: res?.data,
      });
    } else if (res.data.res === "error") {
      dispatch({
        type: adminConstants.CONTRACT_LIST_SUCCESS,
        payload: { ...res.data, contracts: [] },
      });
    }
    return res.data;
  } catch (error) {
    dispatch({
      type: adminConstants.CONTRACT_LIST_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message);
  }
};

export const contractByIdForAdmin = (id) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.CONTRACT_BY_ID_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get(`/${role}/contracts/show/${id}`);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.CONTRACT_BY_ID_SUCCESS,
        payload: res?.data?.contracts,
      });
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.CONTRACT_BY_ID_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.CONTRACT_BY_ID_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const allCountriesForAdmin = () => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.ALL_COUNTRIES_FOR_ADMIN_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get(`/${role}/all-countries`);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.ALL_COUNTRIES_FOR_ADMIN_SUCCESS,
        payload: res?.data?.data,
      });
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.ALL_COUNTRIES_FOR_ADMIN_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.ALL_COUNTRIES_FOR_ADMIN_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const updateCountryStatusForAdmin = (id, data) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.UPDATE_COUNTRY_FOR_ADMIN_REQUEST });
  attachToken();
  try {
    const res = await custAxios.post(
      `/${role}/update-country-status/${id}`,
      data
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.UPDATE_COUNTRY_FOR_ADMIN_SUCCESS,
        payload: res?.data?.data,
      });
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.UPDATE_COUNTRY_FOR_ADMIN_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.UPDATE_COUNTRY_FOR_ADMIN_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const webSetting = (data) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.WEB_SETTING_REQUEST });
  try {
    attachTokenWithFormAxios();
    const res = await formAxios.post(`/${role}/website-settings/update`, data);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.WEB_SETTING_SUCCESS,
        payload: res?.data?.data,
      });
      successMessage(res?.data?.message);
      return res?.data;
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.WEB_SETTING_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.WEB_SETTING_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const webDetailsForAdmin = () => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.WEB_DETAILS_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get(`/${role}/website-settings/show`);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.WEB_DETAILS_SUCCESS,
        payload: res?.data?.data,
      });
      return res?.data;
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.WEB_DETAILS_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.WEB_DETAILS_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const fetchWithdrawRequestListForAdmin =
  (pagination, status = "", dateRange = [null, null]) =>
  async (dispatch) => {
    let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
    if (role === "superadmin") {
      role = "super-admin";
    }
    dispatch({ type: adminConstants.FETCH_WITHDRAW_REQUEST_LIST_REQUEST });
    attachToken();
    try {
      const { page, per_page } = pagination;
      let endpoint = `/${role}/withdraw-request/list?page=${page}&per_page=${per_page}`;

      if (status && status !== "") {
        endpoint = endpoint + `&status=${status}`;
      }

      if (dateRange[0] && dateRange[1]) {
        const [start_date, end_date] = dateRange;
        endpoint =
          endpoint +
          `&start_date=${start_date.toISOString()}&end_date=${end_date.toISOString()}`;
      }
      const res = await custAxios.get(endpoint);
      if (res?.data?.res === "success") {
        dispatch({
          type: adminConstants.FETCH_WITHDRAW_REQUEST_LIST_SUCCESS,
          payload: res?.data?.data,
        });
      } else if (res?.data?.res === "error") {
        dispatch({
          type: adminConstants.FETCH_WITHDRAW_REQUEST_LIST_SUCCESS,
          payload: [],
        });
        dispatch({
          type: adminConstants.FETCH_WITHDRAW_REQUEST_LIST_FAILURE,
          payload: res?.data?.message,
        });
      }
      return res?.data;
    } catch (error) {
      dispatch({
        type: adminConstants.FETCH_WITHDRAW_REQUEST_LIST_FAILURE,
        payload: error?.response?.data?.message || "Server Error",
      });
      errorMessage(error?.response?.data?.message || "Server Error");
      errorMessage(error?.response?.data?.message || "Server Error");
    }
  };

export const updateWithdrawForAdmin = (id, data) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.UPDATE_REQUEST_REQUEST });
  attachToken();
  try {
    const res = await custAxios.post(
      `/${role}/withdraw-request/update/${id}`,
      data
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.UPDATE_REQUEST_SUCCESS,
        payload: res?.data?.data,
      });
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.UPDATE_REQUEST_FAILURE,
        payload: res?.data?.message,
      });
    }
    successMessage(res?.data?.message);
    return res?.data;
  } catch (error) {
    dispatch({
      type: adminConstants.UPDATE_REQUEST_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const fetchFAQsList = () => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.FETCH_FAQS_REQUEST });
  try {
    attachToken();
    const res = await custAxios.get(`/${role}/faqs/list`);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.FETCH_FAQS_SUCCESS,
        payload: res?.data.data,
      });

      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.FETCH_FAQS_SUCCESS,
        payload: [],
      });
      dispatch({
        type: adminConstants.FETCH_FAQS_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.FETCH_FAQS_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const detailsByFaqs = (id) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.DETAIL_BY_FAQS_REQUEST });
  try {
    attachToken();
    const res = await custAxios.get(`/${role}/faqs/details/${id}`);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.DETAIL_BY_FAQS_SUCCESS,
      });
      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.DETAIL_BY_FAQS_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.DETAIL_BY_FAQS_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const createFaqs = (values) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.CREATE_FAQS_REQUEST });
  try {
    attachToken();
    const res = await custAxios.post(`/${role}/faqs/create`, values);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.CREATE_FAQS_SUCCESS,
      });
      dispatch(fetchFAQsList());
      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.CREATE_FAQS_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.CREATE_FAQS_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const deleteFaqs = (id) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.DELETE_FAQS_REQUEST });
  try {
    attachToken();
    const res = await custAxios.get(`/${role}/faqs/delete/${id}`);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.DELETE_FAQS_SUCCESS,
      });
      dispatch(fetchFAQsList());
      successMessage("FAQ Deleted successfully");
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.DELETE_FAQS_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.DELETE_FAQS_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const updateFaqs = (id, values) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.UPDATE_FAQS_REQUEST });
  try {
    attachToken();
    const res = await custAxios.post(`/${role}/faqs/update/${id}`, values);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.UPDATE_FAQS_SUCCESS,
      });
      dispatch(fetchFAQsList());
      successMessage("Faqs updated successfully");
      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.UPDATE_FAQS_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.UPDATE_FAQS_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const reorderFaqs = (values) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.REORDER_FAQS_REQUEST });
  try {
    attachToken();
    const res = await custAxios.post(`/${role}/faqs/reorder`, values);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.REORDER_FAQS_SUCCESS,
      });
      dispatch(fetchFAQsList());
      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.REORDER_FAQS_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.REORDER_FAQS_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const fetchMessages = (pagination) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.FETCH_CONTACT_US_MESSAGES_REQUEST });
  try {
    attachToken();
    const { page, per_page } = pagination;
    const res = await custAxios.get(
      `/${role}/contact-us/messages?page=${page}&per_page=${per_page}`
    );
    if (res.data.res === "success") {
      dispatch({
        type: adminConstants.FETCH_CONTACT_US_MESSAGES_SUCCESS,
        payload: res?.data?.data,
      });
      return res?.data;
    } else if (res.data.res === "error") {
      dispatch({
        type: adminConstants.FETCH_CONTACT_US_MESSAGES_SUCCESS,
        payload: [],
      });
      dispatch({
        type: adminConstants.FETCH_CONTACT_US_MESSAGES_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.FETCH_CONTACT_US_MESSAGES_SUCCESS,
      payload: [],
    });
    dispatch({
      type: adminConstants.FETCH_CONTACT_US_MESSAGES_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
  }
};

export const respondMessage = (data) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.RESPOND_MESSAGE_REQUEST });
  attachToken();
  try {
    const res = await custAxios.post(`/${role}/contact-us/respond`, data);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.RESPOND_MESSAGE_SUCCESS,
        payload: res?.data?.data,
      });
      return res?.data;
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.RESPOND_MESSAGE_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.RESPOND_MESSAGE_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const deleteMessage = (id) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.DELETE_MESSAGE_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get(`/${role}/contact-us/message/${id}/delete`);
    if (res?.data?.res === "success") {
      dispatch({
        type: adminConstants.DELETE_MESSAGE_SUCCESS,
        payload: res?.data,
      });

      return res?.data;
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.DELETE_MESSAGE_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.DELETE_MESSAGE_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const fetchNewsLetter = () => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.FETCH_NEWSLETTER_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get(`/${role}/newsletters/subscribers`);
    if (res?.data.res === "success") {
      dispatch({
        type: adminConstants.FETCH_NEWSLETTER_SUCCESS,
        payload: res?.data?.data,
      });
      return res?.data;
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.FETCH_NEWSLETTER_SUCCESS,
        payload: [],
      });
      dispatch({
        type: adminConstants.FETCH_NEWSLETTER_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.FETCH_NEWSLETTER_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const fetchUserStatistics =
  (lawyerId, date = null) =>
  async (dispatch) => {
    let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
    if (role === "superadmin") {
      role = "super-admin";
    }
    dispatch({ type: adminConstants.FETCH_USERSTATISTICS_REQUEST });
    attachToken();
    try {
      const res = await custAxios.get(
        `/${role}/user-stats/${lawyerId}${date ? `?date=${date}` : ``}`
      );
      if (res.data.res === "success") {
        dispatch({
          type: adminConstants.FETCH_USERSTATISTICS_SUCCESS,
          payload: res?.data?.data,
        });
        return res?.data;
      } else if (res?.data?.res === "error") {
        dispatch({
          type: adminConstants.FETCH_USERSTATISTICS_FAILURE,
          payload: res?.data?.message,
        });
        return "error";
      }
    } catch (error) {
      dispatch({
        type: adminConstants.FETCH_USERSTATISTICS_FAILURE,
        payload: error?.response?.data?.message || "Server Error",
      });
      errorMessage(error?.response?.data?.message || "Server Error");
      errorMessage(error?.response?.data?.message || "Server Error");
    }
  };

export const fetchCarousels = () => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.FETCH_CAROUSELS_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get(`/${role}/carousel/fetch`);
    if (res.data.res === "success") {
      dispatch({
        type: adminConstants.FETCH_CAROUSELS_SUCCESS,
        payload: res?.data?.data,
      });
      return res?.data;
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.FETCH_CAROUSELS_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.FETCH_CAROUSELS_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const addAnImageOfCarousel = (data) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.ADD_AN_IMAGE_OF_CAROSEL_REQUEST });
  attachTokenWithFormAxios();
  try {
    const res = await formAxios.post(`/${role}/carousel/add-image`, data);
    if (res.data.res === "success") {
      dispatch({
        type: adminConstants.ADD_AN_IMAGE_OF_CAROSEL_SUCCESS,
        payload: res?.data?.data,
      });
      return res?.data;
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.ADD_AN_IMAGE_OF_CAROSEL_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.ADD_AN_IMAGE_OF_CAROSEL_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const addCarouselText = (data) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.ADD_CAROUSEL_TEXT_REQUEST });
  attachToken();
  try {
    const res = await custAxios.post(`/${role}/carousel/add-text`, data);
    if (res.data.res === "success") {
      dispatch({
        type: adminConstants.ADD_CAROUSEL_TEXT_SUCCESS,
        payload: res?.data?.data,
      });
      return res?.data;
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.ADD_CAROUSEL_TEXT_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.ADD_CAROUSEL_TEXT_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const updateCarouselText = (id, data) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.UPDATE_CAROUSEL_TEXT_REQUEST });
  attachToken();
  try {
    const res = await custAxios.post(
      `/${role}/carousel/update-text/${id}`,
      data
    );
    if (res.data.res === "success") {
      dispatch({
        type: adminConstants.UPDATE_CAROUSEL_TEXT_SUCCESS,
        payload: res?.data?.data,
      });
      return res?.data;
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.UPDATE_CAROUSEL_TEXT_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.UPDATE_CAROUSEL_TEXT_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const reorderCarousel = (data) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.REORDER_CAROUSEL_REQUEST });
  attachToken();
  try {
    const res = await custAxios.post(`/${role}/carousel/reorder-images`, data);
    if (res.data.res === "success") {
      dispatch({
        type: adminConstants.REORDER_CAROUSEL_SUCCESS,
        payload: res?.data?.data,
      });
      return res?.data;
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.REORDER_CAROUSEL_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.REORDER_CAROUSEL_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const fetchChartData = () => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  attachToken();
  try {
    const res = await custAxios.get(`/${role}/chart-data`);
    if (res.data.res === "success") {
      dispatch({
        type: adminConstants.FETCH_CHART_DATA_SUCCESS,
        payload: res?.data?.data,
      });
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.FETCH_CHART_DATA_FAILURE,
        payload: res?.data?.message,
      });
    }
    return res?.data;
  } catch (error) {
    dispatch({
      type: adminConstants.FETCH_CHART_DATA_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};

export const deleteAnImageOfCarousel = (id) => async (dispatch) => {
  let role = JSON.parse(localStorage.getItem("user"))?.role.toLowerCase();
  if (role === "superadmin") {
    role = "super-admin";
  }
  dispatch({ type: adminConstants.DELETE_AN_IMAGE_OF_CAROUSEL_REQUEST });
  attachToken();
  try {
    const res = await custAxios.get(`/${role}/carousel/delete-image/${id}`);
    if (res.data.res === "success") {
      dispatch({
        type: adminConstants.DELETE_AN_IMAGE_OF_CAROUSEL_SUCCESS,
        payload: res?.data?.data,
      });
      return res?.data;
    } else if (res?.data?.res === "error") {
      dispatch({
        type: adminConstants.DELETE_AN_IMAGE_OF_CAROUSEL_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: adminConstants.DELETE_AN_IMAGE_OF_CAROUSEL_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
  }
};
