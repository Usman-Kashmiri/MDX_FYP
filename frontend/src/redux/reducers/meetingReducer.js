import { meetingConstants } from "../constants/meetingConstants";

export const meetingReducer = (
    state = {
        loading: false,
        meeting: [],
        checkMeeting: [],
    },
    action
) => {
    switch (action.type) {
        case meetingConstants.CHECK_MEETING_REQUEST:
        case meetingConstants.END_MEETING_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case meetingConstants.CHECK_MEETING_SUCCESS:
            return {
                ...state,
                loading: false,
                checkMeeting: action.payload
            };
        case meetingConstants.END_MEETING_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case meetingConstants.CHECK_MEETING_FAILURE:
        case meetingConstants.END_MEETING_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };


        default:
            return state;
    }
};
