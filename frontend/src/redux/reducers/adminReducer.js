import { adminConstants } from "../constants/adminContants";

export const adminReducer = (
  state = {
    jurisdictions: [],
    practice: [],
    moderators: [],
    lawyers: [],
    clients: [],
    dashboard: [],
    contractsList: [],
    webDetails: {},
    loaderOfButton: false,
    allCountries: [],
    withDrawRequestList: [],
    contactMessages: [],
    faqs: [],
    newsletters: [],
    catagorys: [],
    fetchCarousel: [],
    userStatistics: {},
    chartData: [],
  },
  action
) => {
  switch (action.type) {
    case adminConstants.FETCH_PRACTICE_REQUEST: // ? Practice requests
    case adminConstants.ADD_PRACTICE_REQUEST:
    case adminConstants.UPDATE_PRACTICE_REQUEST:
    case adminConstants.DELETE_PRACTICE_REQUEST:
    case adminConstants.FETCH_JURISDICTIONS_REQUEST: // ? Jurisdictions requests
    case adminConstants.ADD_JURISDICTION_REQUEST:
    case adminConstants.UPDATE_JURISDICTION_REQUEST:
    case adminConstants.DELETE_JURISDICTION_REQUEST:
    case adminConstants.FETCH_MODERATORS_REQUEST: // ? moderators requests
    case adminConstants.ADD_MODERATOR_REQUEST:
    case adminConstants.UPDATE_MODERATOR_REQUEST:
    case adminConstants.DELETE_MODERATOR_REQUEST:
    case adminConstants.FETCH_LAWYERS_REQUEST: // ? lawyers requests
    case adminConstants.ADD_LAWYER_REQUEST:
    case adminConstants.UPDATE_LAWYER_REQUEST:
    case adminConstants.DELETE_LAWYER_REQUEST:
    case adminConstants.FETCH_CLIENTS_REQUEST: // ? clienys requests
    case adminConstants.ADD_CLIENT_REQUEST:
    case adminConstants.UPDATE_CLIENT_REQUEST:
    case adminConstants.DELETE_CLIENT_REQUEST:
    case adminConstants.GET_DASHBOARD_REQUEST:
    case adminConstants.CONTRACT_LIST_REQUEST:
    case adminConstants.CONTRACT_BY_ID_REQUEST:
    case adminConstants.ALL_COUNTRIES_FOR_ADMIN_REQUEST:
    case adminConstants.UPDATE_COUNTRY_FOR_ADMIN_REQUEST:
    case adminConstants.WEB_DETAILS_REQUEST:
    case adminConstants.FETCH_WITHDRAW_REQUEST_LIST_REQUEST:
    case adminConstants.FETCH_FAQS_REQUEST:
    case adminConstants.DELETE_FAQS_REQUEST:
    case adminConstants.UPDATE_FAQS_REQUEST:
    case adminConstants.DETAIL_BY_FAQS_REQUEST:
    case adminConstants.FETCH_CONTACT_US_MESSAGES_REQUEST:
    case adminConstants.NEW_CONTACT_US_MESSAGES_REQUEST:
    case adminConstants.FETCH_NEWSLETTER_REQUEST:
    case adminConstants.FETCH_USERSTATISTICS_REQUEST:
    case adminConstants.FETCH_CAROUSELS_REQUEST:
    case adminConstants.UPDATE_CAROUSEL_TEXT_REQUEST:
    case adminConstants.DELETE_AN_IMAGE_OF_CAROUSEL_REQUEST:
    case adminConstants.REORDER_CAROUSEL_REQUEST:
    case adminConstants.ADD_CAROUSEL_TEXT_REQUEST:
    case adminConstants.ADD_AN_IMAGE_OF_CAROSEL_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case adminConstants.CONTRACT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        contractsList: {
          res: action.payload.res,
          message: action.payload.message,
          contracts:
            action.payload.contracts !== undefined
              ? action.payload.contracts
              : [],
        },
      };

    case adminConstants.UPDATE_REQUEST_REQUEST:
    case adminConstants.WEB_SETTING_REQUEST:
    case adminConstants.RESPOND_MESSAGE_REQUEST:
    case adminConstants.DELETE_MESSAGE_REQUEST:
    case adminConstants.REORDER_FAQS_REQUEST:
      return {
        ...state,
        loaderOfButton: true,
      };

    // ? Practice fetch
    case adminConstants.FETCH_PRACTICE_SUCCESS:
      return {
        ...state,
        loading: false,
        practice: action.payload,
      };

    case adminConstants.CONTRACT_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        contractList: action.payload,
      };

    // ? Jurisdictions fetch
    case adminConstants.FETCH_JURISDICTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        jurisdictions: action.payload,
      };

    // ? fetch chart data
    case adminConstants.FETCH_CHART_DATA_SUCCESS:
      return {
        ...state,
        chartData: action.payload,
      };

    // countries for admin
    case adminConstants.ALL_COUNTRIES_FOR_ADMIN_SUCCESS:
      return {
        ...state,
        loading: false,
        allCountries: action.payload,
      };

    // ? moderators fetch
    case adminConstants.FETCH_MODERATORS_SUCCESS:
      return {
        ...state,
        loading: false,
        moderators: action.payload,
      };

    // ? lawyers fetch
    case adminConstants.FETCH_LAWYERS_SUCCESS:
      return {
        ...state,
        loading: false,
        lawyers: action.payload,
      };

    // ? clients fetch
    case adminConstants.FETCH_CLIENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        clients: action.payload,
      };
    case adminConstants.GET_DASHBOARD_SUCCESS:
      return {
        ...state,
        loading: false,
        dashboard: action.payload,
      };
    case adminConstants.WEB_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        webDetails: action.payload,
      };
    case adminConstants.FETCH_WITHDRAW_REQUEST_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        withDrawRequestList: action.payload,
      };
    case adminConstants.FETCH_FAQS_SUCCESS:
    case adminConstants.DETAIL_BY_FAQS_SUCCESS:
      return {
        ...state,
        loading: false,
        faqs: action.payload,
      };

    case adminConstants.FETCH_CONTACT_US_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        contactMessages: action.payload,
      };

    case adminConstants.NEW_CONTACT_US_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        contactMessages: [action.payload, ...state.contactMessages],
      };

    case adminConstants.FETCH_NEWSLETTER_SUCCESS:
      return {
        ...state,
        loading: false,
        newsletters: action.payload,
      };

    case adminConstants.FETCH_USERSTATISTICS_SUCCESS:
      return {
        ...state,
        loading: false,
        userStatistics: action.payload,
      };

    case adminConstants.FETCH_CAROUSELS_SUCCESS:
      return {
        ...state,
        loading: false,
        fetchCarousel: action.payload,
      };

    case adminConstants.ADD_PRACTICE_SUCCESS: // ? Practice success
    case adminConstants.UPDATE_PRACTICE_SUCCESS:
    case adminConstants.DELETE_PRACTICE_SUCCESS:
    case adminConstants.ADD_JURISDICTION_SUCCESS: // ? Jurisdictions success
    case adminConstants.UPDATE_JURISDICTION_SUCCESS:
    case adminConstants.DELETE_JURISDICTION_SUCCESS:
    case adminConstants.ADD_MODERATOR_SUCCESS: // ? moderators success
    case adminConstants.UPDATE_MODERATOR_SUCCESS:
    case adminConstants.DELETE_MODERATOR_SUCCESS:
    case adminConstants.ADD_LAWYER_SUCCESS: // ? lawyers success
    case adminConstants.UPDATE_LAWYER_SUCCESS:
    case adminConstants.DELETE_LAWYER_SUCCESS:
    case adminConstants.ADD_CLIENT_SUCCESS: // ? clients success
    case adminConstants.UPDATE_CLIENT_SUCCESS:
    case adminConstants.DELETE_CLIENT_SUCCESS:
    case adminConstants.UPDATE_COUNTRY_FOR_ADMIN_SUCCESS:
    case adminConstants.DELETE_FAQS_SUCCESS:
    case adminConstants.UPDATE_FAQS_SUCCESS:
    case adminConstants.UPDATE_CAROUSEL_TEXT_SUCCESS:
    case adminConstants.DELETE_AN_IMAGE_OF_CAROUSEL_SUCCESS:
    case adminConstants.REORDER_CAROUSEL_SUCCESS:
    case adminConstants.ADD_CAROUSEL_TEXT_SUCCESS:
    case adminConstants.ADD_AN_IMAGE_OF_CAROSEL_SUCCESS:
    case adminConstants.FETCH_CHART_DATA_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case adminConstants.UPDATE_REQUEST_SUCCESS:
    case adminConstants.WEB_SETTING_SUCCESS:
    case adminConstants.RESPOND_MESSAGE_SUCCESS:
    case adminConstants.DELETE_MESSAGE_SUCCESS:
    case adminConstants.REORDER_FAQS_SUCCESS:
      return {
        ...state,
        loaderOfButton: false,
      };

    case adminConstants.FETCH_PRACTICE_FAILURE: // ? Practice failure
    case adminConstants.ADD_PRACTICE_FAILURE:
    case adminConstants.UPDATE_PRACTICE_FAILURE:
    case adminConstants.DELETE_PRACTICE_FAILURE:
    case adminConstants.FETCH_JURISDICTIONS_FAILURE: // ? jurisdictions failure
    case adminConstants.ADD_JURISDICTION_FAILURE:
    case adminConstants.UPDATE_JURISDICTION_FAILURE:
    case adminConstants.DELETE_JURISDICTION_FAILURE:
    case adminConstants.FETCH_MODERATORS_FAILURE: // ? moderators failure
    case adminConstants.ADD_MODERATOR_FAILURE:
    case adminConstants.UPDATE_MODERATOR_FAILURE:
    case adminConstants.DELETE_MODERATOR_FAILURE:
    case adminConstants.FETCH_LAWYERS_FAILURE: // ? lawyers failure
    case adminConstants.ADD_LAWYER_FAILURE:
    case adminConstants.UPDATE_LAWYER_FAILURE:
    case adminConstants.DELETE_LAWYER_FAILURE:
    case adminConstants.FETCH_CLIENTS_FAILURE: // ? clients failure
    case adminConstants.ADD_CLIENT_FAILURE:
    case adminConstants.UPDATE_CLIENT_FAILURE:
    case adminConstants.DELETE_CLIENT_FAILURE:
    case adminConstants.GET_DASHBOARD_FAILURE:
    case adminConstants.CONTRACT_LIST_FAILURE:
    case adminConstants.CONTRACT_BY_ID_FAILURE:
    case adminConstants.ALL_COUNTRIES_FOR_ADMIN_FAILURE:
    case adminConstants.UPDATE_COUNTRY_FOR_ADMIN_FAILURE:
    case adminConstants.FETCH_WITHDRAW_REQUEST_LIST_FAILURE:
    case adminConstants.WEB_DETAILS_FAILURE:
    case adminConstants.FETCH_FAQS_FAILURE:
    case adminConstants.DELETE_FAQS_FAILURE:
    case adminConstants.UPDATE_FAQS_FAILURE:
    case adminConstants.DETAIL_BY_FAQS_FAILURE:
    case adminConstants.FETCH_CATAGORY_FAILURE:
    case adminConstants.FETCH_CONTACT_US_MESSAGES_FAILURE:
    case adminConstants.NEW_CONTACT_US_MESSAGES_FAILURE:
    case adminConstants.FETCH_CAROUSELS_FAILURE:
    case adminConstants.UPDATE_CAROUSEL_TEXT_FAILURE:
    case adminConstants.DELETE_AN_IMAGE_OF_CAROUSEL_FAILURE:
    case adminConstants.REORDER_CAROUSEL_FAILURE:
    case adminConstants.ADD_CAROUSEL_TEXT_FAILURE:
    case adminConstants.ADD_AN_IMAGE_OF_CAROSEL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };

    case adminConstants.WEB_SETTING_FAILURE:
    case adminConstants.UPDATE_REQUEST_FAILURE:
    case adminConstants.RESPOND_MESSAGE_FAILURE:
    case adminConstants.DELETE_MESSAGE_FAILURE:
    case adminConstants.FETCH_NEWSLETTER_FAILURE:
    case adminConstants.FETCH_USERSTATISTICS_FAILURE:
    case adminConstants.REORDER_FAQS_FAILURE:
      return {
        ...state,
        loaderOfButton: false,
        error: action.payload.message,
      };

    case adminConstants.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
