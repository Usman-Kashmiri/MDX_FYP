import { errorMessage, successMessage } from "../../globalFunctions";
import { UseGetRole } from "../../hooks/auth";
import custAxios, {
  attachToken,
  attachTokenWithFormAxios,
  formAxios,
} from "../../services/axiosConfig";
import { chatConstants } from "../constants/chatConstants";

export const caseRequest = (values) => async (dispatch) => {
  dispatch({ type: chatConstants.CASE_REQUEST_REQUEST });
  try {
    attachToken();
    const res = await custAxios.post("client/case-request", values);
    if (res?.data?.res === "success") {
      dispatch({
        type: chatConstants.CASE_REQUEST_SUCCESS,
        payload: res?.data,
      });
      successMessage("Sent");
      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: chatConstants.CASE_REQUEST_FAILURE,
        payload: res?.message,
      });
      return "error";
    }
  } catch (error) {
    console.error(error);
    dispatch({
      type: chatConstants.CASE_REQUEST_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message);
  }
};

export const offlineUser = (data, original_users) => async (dispatch) => {
  try {

    let index = original_users.findIndex((item) => item.id === data.user.id);

    if (index !== -1) {
      original_users[index].is_online = '0';

      dispatch({
        type: chatConstants.OFFLINE_PEOPLE,
        payload: original_users,
      });
    }  
  } catch (error) {
    dispatch({
      type: chatConstants.FETCH_MESSAGES_FAILURE,
      payload: error?.message,
    });
  }
};
export const onlineUser = (data, original_users) => async (dispatch) => {
  try {

    let index = original_users.findIndex((item) => item.id === data.user.id);
    if (index !== -1) {
      original_users[index].is_online = '1';
      dispatch({
        type: chatConstants.OFFLINE_PEOPLE,
        payload: original_users,
      });
    } 
  } catch (error) {

    dispatch({
      type: chatConstants.FETCH_MESSAGES_FAILURE,
      payload: error?.message,
    });
  }
};


export const peopleChatList = () => async (dispatch) => {
  const role = JSON.parse(localStorage.getItem("user"))?.role;
  dispatch({ type: chatConstants.PEOPLE_CHAT_LIST_REQUEST });
  try {
    attachToken();
    const res = await custAxios.get(
      `${role === "Lawyer" ? "lawyer" : "client"}/chat/people-list`
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: chatConstants.PEOPLE_CHAT_LIST_SUCCESS,
        payload: res?.data?.data,
      });
      fetchUnreadMessage();
      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: chatConstants.PEOPLE_CHAT_LIST_SUCCESS,
        payload: [],
      });
      dispatch({
        type: chatConstants.PEOPLE_CHAT_LIST_FAILURE,
        payload: res?.data.message,
      });
      return "error";
    }
  } catch (error) {
    console.error(error);
    dispatch({
      type: chatConstants.CASE_REQUEST_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message);
  }
};

export const getChatListById = (id, page) => async (dispatch) => {
  const role = JSON.parse(localStorage.getItem("user"))?.role;
  dispatch({ type: chatConstants.GET_CHAT_LIST_BY_ID_REQUEST });
  try {
    attachToken();
    const res = await custAxios.get(
      `${role === "Lawyer" ? "lawyer" : "client"}/chat/list/${id}?page=${page || 1
      }`
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: chatConstants.GET_CHAT_LIST_BY_ID_SUCCESS,
        payload: { receiver_id: id, ...res?.data },
      });

      dispatch({
        type: chatConstants.SET_CASE_STATUS,
        payload: res?.data?.case_status,
      });

      return res?.data;
    } else if (res?.data?.res === "error") {
      dispatch({
        type: chatConstants.GET_CHAT_LIST_BY_ID_SUCCESS,
        payload: [],
      });
      dispatch({
        type: chatConstants.GET_CHAT_LIST_BY_ID_FAILURE,
        payload: res?.data.message,
      });
      return "error";
    }
  } catch (error) {
    console.error(error);
    dispatch({
      type: chatConstants.CASE_REQUEST_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    // errorMessage("Internal Server Error");
  }
};

export const fetchMoreMessages = (id, page) => async (dispatch) => {
  const role = JSON.parse(localStorage.getItem("user"))?.role;
  dispatch({ type: chatConstants.FETCH_MORE_MESSAGES_REQUEST });
  try {
    attachToken();
    const res = await custAxios.get(
      `${role === "Lawyer" ? "lawyer" : "client"}/chat/list/${id}?page=${page || 1
      }`
    );

    if (res?.data?.res === "success") {
      dispatch({
        type: chatConstants.FETCH_MORE_MESSAGES_SUCCESS,
        payload: { receiver_id: id, ...res?.data },
      });

      return res?.data;
    } else if (res?.data?.res === "error") {
      dispatch({
        type: chatConstants.FETCH_MORE_MESSAGES_SUCCESS,
        payload: [],
      });
      dispatch({
        type: chatConstants.FETCH_MORE_MESSAGES_FAILURE,
        payload: res?.data.message,
      });
      return "error";
    }
  } catch (error) {
    console.error(error.response.data.message);
  }
};

export const sendNewMessage = (values) => async (dispatch) => {
  dispatch({
    type: chatConstants.SEND_MESSAGE_REQUEST,
  });
  try {
    dispatch({
      type: chatConstants.SEND_MESSAGE_SUCCESS,
      payload: values,
    });
  } catch (error) {
    console.error(error);
    errorMessage(error?.message);
    dispatch({
      type: chatConstants.SEND_MESSAGE_FAILURE,
      payload: error?.message,
    });
  }
};

export const fetchAllMessages = (messages) => async (dispatch) => {
  dispatch({
    type: chatConstants.FETCH_MESSAGES_REQUEST,
  });
  try {
    dispatch({
      type: chatConstants.FETCH_MESSAGES_SUCCESS,
      payload: messages,
    });
    dispatch(peopleChatList());
  } catch (error) {
    errorMessage(error?.message);
    dispatch({
      type: chatConstants.FETCH_MESSAGES_FAILURE,
      payload: error?.message,
    });
  }
};

export const markAsReadMessages = (senderId) => async (dispatch) => {
  const role = JSON.parse(localStorage.getItem("user"))?.role;
  try {
    attachToken();
    const res = await custAxios.get(
      `${role === "Lawyer" ? "lawyer" : "client"}/chat/mark-as-read/${senderId}`
    );
    if (res.data.success) {
      dispatch(fetchUnreadMessage());
      dispatch(peopleChatList());
    }
  } catch (error) {
    errorMessage(error?.message);
    dispatch({
      type: chatConstants.FETCH_MESSAGES_FAILURE,
      payload: error?.message,
    });
  }
};

export const attachmentChatList = () => async (dispatch) => {
  const role = JSON.parse(localStorage.getItem("user"))?.role;
  dispatch({ type: chatConstants.ATTACHMENT_CHAT_LIST_REQUEST });
  try {
    attachToken();
    const res = await custAxios.get(
      `${role === "Lawyer" ? "lawyer" : "client"}/chat/attachment/image`
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: chatConstants.ATTACHMENT_CHAT_LIST_SUCCESS,
        payload: res?.data.data,
      });
      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: chatConstants.ATTACHMENT_CHAT_LIST_SUCCESS,
        payload: [],
      });
      dispatch({
        type: chatConstants.ATTACHMENT_CHAT_LIST_FAILURE,
        payload: res?.data?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: chatConstants.CASE_REQUEST_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message);
  }
};

export const createChat = (values) => async (dispatch) => {
  const role = JSON.parse(localStorage.getItem("user"))?.role;
  dispatch({ type: chatConstants.CREATE_CHAT_REQUEST });
  try {
    await attachTokenWithFormAxios();
    const res = await formAxios.post(
      `${role === "Lawyer" ? "lawyer" : "client"}/chat/create`,
      values
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: chatConstants.CREATE_CHAT_SUCCESS,
      });
      dispatch(fetchAllMessages({ ...res?.data?.data, alignment: "right" }));
      return res?.data?.data;
    }
  } catch (error) {
    dispatch({
      type: chatConstants.CREATE_CHAT_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message);
  }
};

export const testChatEvent = (values) => async (dispatch) => {
  const role = JSON.parse(localStorage.getItem("user"))?.role;
  dispatch({ type: chatConstants.TEST_CHAT_EVENT_REQUEST });
  try {
    attachToken();
    const res = await custAxios.post(
      `${role === "Lawyer" ? "lawyer" : "client"}/chat/attachment/image`,
      values
    );
    if (res?.data?.res === "success") {
      dispatch({
        type: chatConstants.TEST_CHAT_EVENT_SUCCESS,
        payload: res?.data,
      });
      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: chatConstants.TEST_CHAT_EVENT_FAILURE,
        payload: res?.message,
      });
      return "error";
    }
  } catch (error) {
    dispatch({
      type: chatConstants.TEST_CHAT_EVENT_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message);
  }
};

export const attachmentListAction =
  (attachmentType, senderId) => async (dispatch) => {
    const role = JSON.parse(localStorage.getItem("user"))?.role;
    dispatch({ type: chatConstants.ATTACHMENT_LIST_REQUEST });
    try {
      attachToken();
      const res = await custAxios.get(
        `${role === "Lawyer" ? "lawyer" : "client"
        }/chat/attachment/${attachmentType}/${senderId}`
      );
      if (res?.data?.res === "success") {
        dispatch({
          type: chatConstants.ATTACHMENT_LIST_SUCCESS,
          payload: res?.data?.data,
        });
        return "success";
      } else if (res?.data?.res === "error") {
        dispatch({
          type: chatConstants.ATTACHMENT_LIST_FAILURE,
          payload: res?.message,
        });
        return "error";
      }
    } catch (error) {
      dispatch({
        type: chatConstants.ATTACHMENT_LIST_FAILURE,
        payload: error?.response?.data?.message || "Server Error",
      });
      errorMessage(error?.response?.data?.message);
    }
  };

export const fetchUnreadMessage = () => async (dispatch) => {
  dispatch({ type: chatConstants.FETCH_UNREAD_MESSAGES_REQUEST });
  const role = JSON.parse(localStorage.getItem("user"))?.role;
  try {
    attachToken();
    const res = await custAxios.get(
      `${role?.toLowerCase()}/chat/unread-messages`
    );
    if (res?.data?.success) {
      dispatch({
        type: chatConstants.FETCH_UNREAD_MESSAGES_SUCCESS,
        payload: res?.data?.data,
      });
      return "success";
    } else if (res?.data?.res === "error") {
      dispatch({
        type: chatConstants.FETCH_UNREAD_MESSAGES_FAILURE,
        payload: res?.message,
      });
      return "error";
    }
  } catch (error) {
    console.error(error);
    dispatch({
      type: chatConstants.CASE_REQUEST_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    // errorMessage(error?.response?.data?.message);
  }
};
