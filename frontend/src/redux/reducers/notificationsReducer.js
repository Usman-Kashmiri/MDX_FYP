import { notificationsConstants } from "../constants/notificationsConstants";

export const notificationsReducer = (
  state = {
    loading: false,
    notifications: [],
    deleteLoading: false,
    unread_count:0,
  },
  action
) => {
  switch (action.type) {
    case notificationsConstants.GET_NOTIFICATIONS_REQUEST:
      return {
        ...state,
        loading: true,
      };


    case notificationsConstants.GET_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload,
      };
    case notificationsConstants.COUNT_NOTIFICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        unread_count: action.payload,
      };

    case notificationsConstants.GET_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case notificationsConstants.DELETE_NOTIFICATION_REQUEST:
      return {
        ...state,
        deleteLoading: true,
      };
    case notificationsConstants.DELETE_NOTIFICATION_SUCCESS:
      const filteredNotifications = state.notifications.data.filter((item) => item.id !== action.payload);
      return {
        ...state,
        deleteLoading: false,
        notifications: {
          ...state.notifications,
          data: filteredNotifications,
        }

      };
    case notificationsConstants.DELETE_NOTIFICATION_FAILURE:
      return {
        ...state,
        deleteLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
