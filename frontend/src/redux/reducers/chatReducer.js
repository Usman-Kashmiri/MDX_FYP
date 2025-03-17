import { chatConstants } from "../constants/chatConstants";

export const chatReducer = (
  state = {
    val: null,
    loading: false,
    listLoading: false,
    messagesLoading: false,
    caseStatus: 1,
    lawyer_id: null,
    messages: {},
    unreadMessages: 0,
    users: [],
    attachmentList: [],
    original_users: [],
  },
  action
) => {
  switch (action.type) {
    case chatConstants.CASE_REQUEST_REQUEST:
    case chatConstants.GET_CHAT_LIST_BY_ID_REQUEST:
    case chatConstants.ATTACHMENT_CHAT_LIST_REQUEST:
    case chatConstants.CREATE_CHAT_REQUEST:
    case chatConstants.TEST_CHAT_EVENT_REQUEST:
    case chatConstants.ATTACHMENT_LIST_REQUEST:
    case chatConstants.FETCH_UNREAD_MESSAGES_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case chatConstants.PEOPLE_CHAT_LIST_REQUEST:
      return {
        ...state,
        listLoading: true,
      };

    case chatConstants.FETCH_MESSAGES_REQUEST:
      return {
        ...state,
        messagesLoading: true,
      };

    case chatConstants.CASE_REQUEST_SUCCESS:
    case chatConstants.ATTACHMENT_CHAT_LIST_SUCCESS:
    case chatConstants.CREATE_CHAT_SUCCESS:
    case chatConstants.TEST_CHAT_EVENT_SUCCESS:
      return {
        ...state,
        listLoading: false,
        messageLoading: false,
        loading: false,
      };

    case chatConstants.ATTACHMENT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        attachmentList: action?.payload,
      };

    case chatConstants.FETCH_UNREAD_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        unreadMessages: action.payload,
      };
    case chatConstants.GET_CHAT_LIST_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: {
          ...action.payload,
          data: action?.payload?.data ? action?.payload?.data?.reverse() : [],
        },
      };

    case chatConstants.FETCH_MORE_MESSAGES_SUCCESS:
      if (action.payload.receiver_id === state.messages.receiver_id) {
        return {
          ...state,
          loading: false,
          messages: {
            ...state.messages,
            data: [
              ...action?.payload?.data?.reverse(),
              ...state?.messages?.data,
            ],
          },
        };
      }

      return {
        ...state,
        loading: false,
        messages: {
          ...action.payload,
          data: action?.payload?.data ? action?.payload?.data?.reverse() : [],
        },
      };

    case chatConstants.SET_CASE_STATUS:
      return {
        ...state,
        caseStatus: action.payload,
      };

    case chatConstants.OFFLINE_PEOPLE:
      return {
        ...state,
        users: action?.payload,
      };
    case chatConstants.PEOPLE_CHAT_LIST_SUCCESS:
      let sortedUsers = [];

      if (action?.payload && action?.payload?.length > 0) {
        sortedUsers = action.payload.sort((a, b) => {
          const timestampA = new Date(a?.latest_chat_data?.updated_at);
          const timestampB = new Date(b?.latest_chat_data?.updated_at);
          return timestampB - timestampA;
        });
      }

      return {
        ...state,
        listLoading: false,
        loading: false,
        users: sortedUsers,
        original_users: sortedUsers,
      };

    case chatConstants.SEND_MESSAGE_SUCCESS:
      let sortedUsersArray;
      if (state.users.length > 0) {
        const updatedUser = state.users.find(
          (user) => user.id === action.payload.id
        );

        if (updatedUser) {
          updatedUser.latest_chat_data.message = action.payload.message.message;
          sortedUsersArray = [
            updatedUser,
            ...state.users.filter((user) => user.id !== action.payload.id),
          ];
        } else {
          sortedUsersArray = state.users;
        }
      }

      return {
        ...state,
        users: sortedUsersArray,
        sortedUsers: sortedUsersArray,
        messages: {
          ...state?.messages,
          data: [...state?.messages?.data, action.payload.message],
        },
      };

    case chatConstants.FETCH_MESSAGES_SUCCESS:
      const updatedMessages = state?.messages?.data
        ?.map((item, index, array) => {
          if (
            item?.alignment === "right" &&
            item?.time_stamp === action?.payload?.time_stamp &&
            item?.status === "pending"
          ) {
            return undefined;
          } else {
            if (
              array?.some((arrayItem) => {
                if (
                  arrayItem?.time_stamp === item?.time_stamp &&
                  arrayItem?.status === "pending"
                ) {
                  return true;
                }
                return false;
              })
            ) {
              return undefined;
            }
          }
          return item;
        })
        ?.filter((item) => item !== undefined);

      if (
        updatedMessages &&
        !updatedMessages.some((msg) => msg.id === action.payload.id)
      ) {
        updatedMessages.push(action.payload);
      }

      return {
        ...state,
        messagesLoading: false,
        messages: {
          ...state?.messages,
          data: updatedMessages,
        },
      };

    case chatConstants.CASE_REQUEST_FAILURE:
    case chatConstants.GET_CHAT_LIST_BY_ID_FAILURE:
    case chatConstants.ATTACHMENT_CHAT_LIST_FAILURE:
    case chatConstants.CREATE_CHAT_FAILURE:
    case chatConstants.TEST_CHAT_EVENT_FAILURE:
    case chatConstants.ATTACHMENT_LIST_FAILURE:
    case chatConstants.SEND_MESSAGE_FAILURE:
    case chatConstants.FETCH_UNREAD_MESSAGES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };

    case chatConstants.PEOPLE_CHAT_LIST_FAILURE:
      return {
        ...state,
        listLoading: false,
        error: action.payload,
      };

    case chatConstants.FETCH_MESSAGES_FAILURE:
      return {
        ...state,
        messagesLoading: false,
        error: action.payload,
      };

    case chatConstants.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
