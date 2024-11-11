import { combineReducers } from "redux";

// import reducer
import userDetails from "./userReducer";
import webDetails from "./websiteReducer";

export default combineReducers({
    userDetails,
    webDetails
});
