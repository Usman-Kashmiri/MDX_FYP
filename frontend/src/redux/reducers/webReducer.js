import { webConstants } from "../constants/webContants";
import { io } from "socket.io-client";
let socketUri = "https://nbundl.up.railway.app/"; // Production,
// let socketUri = 'http://localhost:3003/' // local,
let getLocalSiteDetail = localStorage.getItem("webDetails");
if (getLocalSiteDetail != "") {
  getLocalSiteDetail = JSON.parse(getLocalSiteDetail);
} else {
  getLocalSiteDetail = {
    id: 1,
    site_name: "The MDX Lawsuit",
    site_email: "info@mdxlawsuit.com",
    site_contact: "090078601",
    site_logo: "https://nbundl.s3.amazonaws.com/site/660a8ff502ae0.webp",
    site_favicon: "https://nbundl.s3.amazonaws.com/site/660a8ff575ad3.webp",
  };
}
export const webReducer = (
  state = {
    socket: io(socketUri, {
      autoConnect: false,
    }),
    loading: false,
    error: null,
    featuredLawyers: [],
    foundLawyers: [],
    caseTypes: [],
    jurisdictions: [],
    comments: [],
    LawyerById: {},
    subscribeData: {},
    countries: [],
    webDetails: getLocalSiteDetail,
    fetchFAQsList: [],
    fetchCarousel: {},
  },
  action
) => {
  switch (action.type) {
    case webConstants.FETCH_FEATURED_LAWYER_REQUEST: // ? Update personal info request
    case webConstants.FIND_LAWYER_REQUEST: // ? Update personal info request
    case webConstants.FETCH_PRACTICE_REQUEST: // ? Update personal info request
    case webConstants.GET_LAWYER_BY_ID_REQUEST: // ? Update personal info request
    case webConstants.GET_JURISDICTION_BY_COUNTRY_REQUEST: // ? Update personal info request
    case webConstants.GET_COUNTRIES_OF_JURISDICTIONS_REQUEST: // ? Update personal info request
    case webConstants.FETCH_WEB_DETAILS_REQUEST: // ? Update personal info request
    case webConstants.SUBSCRIBE_REQUEST: // ? Update personal info request
    case webConstants.UNSUBSCRIBE_REQUEST: // ? Update personal info request
    case webConstants.POST_A_MESSAGE_REQUEST: // ? Update personal info request
    case webConstants.FETCH_FAQS_REQUEST: // ? Update personal info request
    case webConstants.FETCH_CAROUSELS_REQUEST: // ? Update personal info request
      return {
        ...state,
        loading: true,
      };

    case webConstants.FETCH_FEATURED_LAWYER_SUCCESS: // ? Update personal info success
      return {
        ...state,
        loading: false,
        featuredLawyers: action.payload,
      };

    case webConstants.FIND_LAWYER_SUCCESS: // ? Update personal info success
      return {
        ...state,
        loading: false,
        foundLawyers: action.payload,
      };

    case webConstants.FETCH_PRACTICE_SUCCESS: // ? Update personal info success
      return {
        ...state,
        loading: false,
        caseTypes: action.payload,
      };

    case webConstants.SUBSCRIBE_SUCCESS: // ? Update personal info success
    case webConstants.UNSUBSCRIBE_SUCCESS: // ? Update personal info success
      return {
        ...state,
        loading: false,
        subscribeData: action.payload,
      };

    case webConstants.GET_JURISDICTION_BY_COUNTRY_SUCCESS: // ? Update personal info success
      return {
        ...state,
        loading: false,
        jurisdictions: action.payload,
      };

    case webConstants.FETCH_JURISDICTIONS_SUCCESS: // ? Update personal info success
      return {
        ...state,
        loading: false,
        jurisdictions: action.payload,
      };

    case webConstants.GET_LAWYER_BY_ID_SUCCESS: // ? Update personal info success
      return {
        ...state,
        loading: false,
        LawyerById: action.payload,
      };

    case webConstants.GET_COUNTRIES_OF_JURISDICTIONS_SUCCESS: // ? Update personal info success
      return {
        ...state,
        loading: false,
        countries: action.payload,
      };

    case webConstants.FETCH_WEB_DETAILS_SUCCESS: // ? Update personal info success
      return {
        ...state,
        loading: false,
        webDetails: action.payload,
      };

    case webConstants.FETCH_FAQS_SUCCESS: // ? Update personal info success
      return {
        ...state,
        loading: false,
        fetchFAQsList: action.payload,
      };

    case webConstants.FETCH_CAROUSELS_SUCCESS:
      return {
        ...state,
        loading: false,
        fetchCarousel: action.payload,
      };

    case webConstants.POST_A_MESSAGE_SUCCESS: // ? Update personal info success
      return {
        ...state,
        loading: false,
      };

    case webConstants.FETCH_FEATURED_LAWYER_FAILURE: // ? Update personal info failure
    case webConstants.FIND_LAWYER_FAILURE: // ? Update personal info failure
    case webConstants.FETCH_PRACTICE_FAILURE: // ? Update personal info failure
    case webConstants.GET_LAWYER_BY_ID_FAILURE: // ? Update personal info failure
    case webConstants.GET_JURISDICTION_BY_COUNTRY_FAILURE: // ? Update personal info failure
    case webConstants.GET_COUNTRIES_OF_JURISDICTIONS_FAILURE: // ? Update personal info failure
    case webConstants.FETCH_WEB_DETAILS_FAILURE: // ? Update personal info failure
    case webConstants.SUBSCRIBE_FAILURE: // ? Update personal info failure
    case webConstants.UNSUBSCRIBE_FAILURE: // ? Update personal info failure
    case webConstants.POST_A_MESSAGE_FAILURE: // ? Update personal info failure
    case webConstants.FETCH_FAQS_FAILURE: // ? Update personal info failure
    case webConstants.FETCH_CAROUSELS_FAILURE: // ? Update personal info failure
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default: // ? defaaaalt case yk...!
      return state;
  }
};
