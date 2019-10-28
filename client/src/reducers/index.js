import { combineReducers } from "redux";
import authReducer from "./authReducer";
import claimsReducer from "./claimsReducer";
import groupReducer from "./groupReducer";
import web3Reducer from "./web3Reducers";
import errorReducer from "./errorReducer";
import utilReducer from "./utilReducer";
import alert from "./alert";
export default combineReducers({
  user: authReducer,
  claims: claimsReducer,
  group: groupReducer,
  ethereum: web3Reducer,
  error: errorReducer,
  alert: alert,
  utilReducer: utilReducer
});
