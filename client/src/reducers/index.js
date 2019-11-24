import { combineReducers } from "redux";
import authReducer from "./authReducer";
import claimsReducer from "./claimsReducer";
import groupReducer from "./groupReducer";
import web3Reducer from "./web3Reducers";
import errorReducer from "./errorReducer";
import utilReducer from "./utilReducer";
import alert from "./alert";
import ethAlertReducer from "./ethAlertReducer";
import transferReducer from "./transferReducer";
import premiumReducer from "./premiumReducer";
export default combineReducers({
  user: authReducer,
  transfers: transferReducer,
  claims: claimsReducer,
  group: groupReducer,
  ethereum: web3Reducer,
  error: errorReducer,
  alert: alert,
  ethAlertReducer: ethAlertReducer,
  utilReducer: utilReducer,
  premiums: premiumReducer
});
