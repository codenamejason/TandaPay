import { combineReducers } from "redux";
import authReducer from "./authReducer";
import claimsReducer from "./claimsReducer";
export default combineReducers({
	user: authReducer,
	claims: claimsReducer
});
