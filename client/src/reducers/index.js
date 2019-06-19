import { combineReducers } from "redux";
import authReducer from "./authReducer";
import claimsReducer from "./claimsReducer";
import groupReducer from "./groupReducer";
export default combineReducers({
	user: authReducer,
	claims: claimsReducer,
	group: groupReducer,
});
