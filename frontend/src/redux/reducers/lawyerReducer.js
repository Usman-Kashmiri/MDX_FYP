import { lawyerConstants } from "../constants/lawyerConstants";

export const lawyerReducer = (
  state = {
    loading: false,
    error: null,
    lawyerAvailableTime: [],
    lawyerCases: [],
    timeSlot: [],
    clientsList: [],
    contractsList: {},
    contractList: [],
    appointmentsList: [],
    transactionsList: [],
    withdrawRquestList: [],
    milestoneStages: [],
    milestoneSteps: [],
    withdrawRquest: {},
    resOfCreation: {},
    transaction: {},
  },
  action
) => {
  switch (action.type) {
    case lawyerConstants.LAWYER_AVAILIBILITY_REQUEST:
    case lawyerConstants.GET_LAWYER_AVAILIBILITY_REQUEST:
    case lawyerConstants.UPDATE_LAWYER_AVAILIBILITY_REQUEST:
    case lawyerConstants.GET_LAWYER_CASES_REQUEST:
    case lawyerConstants.GENERATE_TIME_SLOT_REQUEST:
    case lawyerConstants.CONTRACT_CREATION_REQUEST:
    case lawyerConstants.GET_TIME_SLOT_REQUEST:
    case lawyerConstants.CLIENT_LIST_REQUEST:
    case lawyerConstants.CONTRACT_LIST_REQUEST:
    case lawyerConstants.CONTRACT_BY_ID_REQUEST:
    case lawyerConstants.APPOINTMENT_LIST_REQUEST:
    case lawyerConstants.REQUEST_CONTRACT_REQUEST:
    case lawyerConstants.TRANSACTION_LIST_REQUEST:
    case lawyerConstants.TRANSACTION_BY_ID_REQUEST:
    case lawyerConstants.WITHDRAW_REQUEST_LIST_REQUEST:
    case lawyerConstants.WITHDRAW_REQUEST_REQUEST:
    case lawyerConstants.CREATE_MILESTONE_STAGE_REQUEST:
    // case lawyerConstants.GET_MILESTONE_STAGE_REQUEST:
    case lawyerConstants.CREATE_MILESTONE_STEP_REQUEST:
    case lawyerConstants.GET_MILESTONE_STEP_REQUEST:
    case lawyerConstants.UPDATE_IBAN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case lawyerConstants.GET_MILESTONE_STAGE_REQUEST:
      return {
        ...state,
        loading: false,
      };

    case lawyerConstants.LAWYER_AVAILIBILITY_SUCCESS:
    case lawyerConstants.CONTRACT_CREATION_SUCCESS:
      return {
        ...state,
        loading: false,
        resOfCreation: action.payload,
      };

    case lawyerConstants.UPDATE_LAWYER_AVAILIBILITY_SUCCESS:
    case lawyerConstants.GET_LAWYER_AVAILIBILITY_SUCCESS:
      return {
        ...state,
        loading: false,
        lawyerAvailableTime: action.payload,
      };

    case lawyerConstants.GET_LAWYER_CASES_SUCCESS:
      return {
        ...state,
        loading: false,
        lawyerCases: action.payload,
      };

    case lawyerConstants.GET_TIME_SLOT_SUCCESS:
      return {
        ...state,
        loading: false,
        timeSlot: action.payload,
      };

    case lawyerConstants.CLIENT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        clientsList: action.payload,
      };

    case lawyerConstants.CONTRACT_LIST_SUCCESS:
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
    case lawyerConstants.REQUEST_CONTRACT_SUCCESS:
      return {
        ...state,
        loading: false,
        contractsList: {
          res: action.payload.res,
          message: action.payload.message
        }
      };

    case lawyerConstants.TRANSACTION_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        transactionsList: action.payload,
      };

    case lawyerConstants.WITHDRAW_REQUEST_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        withdrawRquestList: action.payload,
      };

    case "UPDATE_IBAN":
      return {
        ...state,
        loading: false,
        withdrawRquestList: {
          ...state?.withdrawRquestList,
          iban: action?.payload,
        },
      };

    case lawyerConstants.WITHDRAW_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        withdrawRquest: action.payload,
      };

    case lawyerConstants.TRANSACTION_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        transaction: action.payload,
      };

    case lawyerConstants.CONTRACT_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        contractList: action.payload,
      };

    case lawyerConstants.APPOINTMENT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        appointmentsList: action.payload,
      };

    case lawyerConstants.GET_MILESTONE_STAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        milestoneStages: action.payload,
      };

    case lawyerConstants.GET_MILESTONE_STEP_SUCCESS:
      return {
        ...state,
        loading: false,
        milestoneSteps: action.payload,
      };

    case lawyerConstants.CREATE_MILESTONE_STAGE_SUCCESS:
    case lawyerConstants.CREATE_MILESTONE_STEP_SUCCESS:
    case lawyerConstants.UPDATE_IBAN_SUCCESS:
    case lawyerConstants.REQUEST_CONTRACT_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case lawyerConstants.LAWYER_AVAILIBILITY_FAILURE: // ? Update personal info failure
    case lawyerConstants.GET_LAWYER_AVAILIBILITY_FAILURE: // ? Update profile picture failure
    case lawyerConstants.UPDATE_LAWYER_AVAILIBILITY_FAILURE: // ? Update profile picture failure
    case lawyerConstants.GET_LAWYER_CASES_FAILURE: // ? Update profile picture failure
    case lawyerConstants.GET_TIME_SLOT_FAILURE: // ? Update profile picture failure
    case lawyerConstants.GENERATE_TIME_SLOT_FAILURE: // ? Update profile picture failure
    case lawyerConstants.CONTRACT_CREATION_FAILURE: // ? Update profile picture failure
    case lawyerConstants.CLIENT_LIST_FAILURE: // ? Update profile picture failure
    case lawyerConstants.CONTRACT_LIST_FAILURE: // ? Update profile picture failure
    case lawyerConstants.CONTRACT_BY_ID_FAILURE: // ? Update profile picture failure
    case lawyerConstants.REQUEST_CONTRACT_FAILURE: // ? Update profile picture failure
    case lawyerConstants.TRANSACTION_LIST_FAILURE: // ? Update profile picture failure
    case lawyerConstants.TRANSACTION_BY_ID_FAILURE: // ? Update profile picture failure
    case lawyerConstants.WITHDRAW_REQUEST_LIST_FAILURE: // ? Update profile picture failure
    case lawyerConstants.WITHDRAW_REQUEST_FAILURE:
    case lawyerConstants.CREATE_MILESTONE_STAGE_FAILURE:
    case lawyerConstants.GET_MILESTONE_STAGE_FAILURE:
    case lawyerConstants.CREATE_MILESTONE_STEP_FAILURE:
    case lawyerConstants.GET_MILESTONE_STEP_FAILURE:
    case lawyerConstants.UPDATE_IBAN_FAILURE:
    case lawyerConstants.REQUEST_CONTRACT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default: // ? defaaaalt case yk...!
      return state;
  }
};
