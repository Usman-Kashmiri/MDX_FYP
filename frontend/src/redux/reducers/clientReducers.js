import { clientConstants } from "../constants/clientConstant";

export const clientReducer = (
  state = {
    loading: false,
    error: null,
    dashboard: [],
    timeSlot: [],
    consultation: [],
    contractsList: {},
    contractList: {},
    appointmentsList: [],
    milestoneStages: [],
    milestoneSteps: [],
    payment: {},
    approveContract: {},
    acceptContract: {},
    checkAbilityToChat: {},
    lawyerAvailibility: [],
  },
  action
) => {
  switch (action.type) {
    case clientConstants.GET_CLIENT_DASHBOARD_REQUEST:
    case clientConstants.BOOK_APPOINTMENT_REQUEST:
    case clientConstants.CONTRACT_LIST_REQUEST:
    case clientConstants.CONTRACT_BY_ID_REQUEST:
    case clientConstants.PAYMENT_OF_CONTRACT_REQUEST:
    case clientConstants.APPROVE_CONTRACT_REQUEST:
    case clientConstants.ACCEPT_CONTRACT_REQUEST:
    case clientConstants.APPOINTMENT_LIST_REQUEST:
    case clientConstants.VIEW_MILESTONE_STAGES_REQUEST:
    case clientConstants.VIEW_MILESTONE_STEPS_REQUEST:
    case clientConstants.IS_ABLE_TO_CHAT_REQUEST:
    case clientConstants.GET_LAWYER_AVAILIBILITY_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case clientConstants.GET_CLIENT_DASHBOARD_SUCCESS:
      return {
        ...state,
        loading: false,
        dashboard: action.payload,
      };

    case clientConstants.APPOINTMENT_LIST_SUCCESS: // ? fetch appointments success
      return {
        ...state,
        loading: false,
        appointmentsList: action.payload,
      };

    case clientConstants.GET_LAWYER_AVAILIBILITY_SUCCESS:
      return {
        ...state,
        loading: false,
        lawyerAvailibility: action.payload,
      };

    case clientConstants.PAYMENT_OF_CONTRACT_SUCCESS:
      return {
        ...state,
        loading: false,
        payment: action.payload,
      };

    case clientConstants.GET_CLIENT_TIME_SLOT_SUCCESS:
      return {
        ...state,
        loading: false,
        timeSlot: action.payload,
      };

    case clientConstants.APPROVE_CONTRACT_SUCCESS:
    case clientConstants.ACCEPT_CONTRACT_SUCCESS:
      return {
        ...state,
        loading: false,
        acceptContract: action.payload,
      };

    case clientConstants.BOOK_APPOINTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case clientConstants.CONTRACT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        contractsList: {
          ...action.payload,
          contracts: [...action.payload.contracts],
        },
      };

    case clientConstants.CONTRACT_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        contractList: action.payload,
      };

    case clientConstants.VIEW_MILESTONE_STAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        milestoneStages: action.payload,
      };

    case clientConstants.VIEW_MILESTONE_STEPS_SUCCESS:
      return {
        ...state,
        loading: false,
        milestoneSteps: action.payload,
      };

    case clientConstants.IS_ABLE_TO_CHAT_SUCCESS:
      return {
        ...state,
        loading: false,
        checkAbilityToChat: action.payload,
      };

    case clientConstants.GET_CLIENT_DASHBOARD_FAILURE:
    case clientConstants.GET_CLIENT_TIME_SLOT_FAILURE:
    case clientConstants.BOOK_APPOINTMENT_FAILURE:
    case clientConstants.CONTRACT_LIST_FAILURE:
    case clientConstants.CONTRACT_BY_ID_FAILURE:
    case clientConstants.PAYMENT_OF_CONTRACT_FAILURE:
    case clientConstants.APPROVE_CONTRACT_FAILURE:
    case clientConstants.ACCEPT_CONTRACT_FAILURE:
    case clientConstants.APPOINTMENT_LIST_FAILURE:
    case clientConstants.VIEW_MILESTONE_STAGES_FAILURE:
    case clientConstants.VIEW_MILESTONE_STEPS_FAILURE:
    case clientConstants.IS_ABLE_TO_CHAT_FAILURE:
    case clientConstants.GET_LAWYER_AVAILIBILITY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default: // ? defaaaalt case yk...!
      return state;
  }
};
