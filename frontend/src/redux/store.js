import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { authReducer } from "./reducers/authReducer";
import { formReducer } from "./reducers/formReducer";
import { adminReducer } from "./reducers/adminReducer";
import { userReducer } from "./reducers/userReducer";
import { webReducer } from "./reducers/webReducer";
import { chatReducer } from "./reducers/chatReducer";
import { lawyerReducer } from "./reducers/lawyerReducer";
import { clientReducer } from "./reducers/clientReducers";
import { meetingReducer } from "./reducers/meetingReducer";
import { caseReducer } from "./reducers/caseReducer";
import { notificationsReducer } from "./reducers/notificationsReducer";

const reducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  case: caseReducer,
  formFields: formReducer,
  admin: adminReducer,
  web: webReducer,
  chat: chatReducer,
  lawyer: lawyerReducer,
  client: clientReducer,
  meeting: meetingReducer,
  notification: notificationsReducer,
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
