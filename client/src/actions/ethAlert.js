import uuid from "uuid";
import { SET_ETH_ALERT, REMOVE_ETH_ALERT } from "./types";

export const setEthAlert = (
  msg,
  alertType,
  timeout = 30000,
  alertHash
) => dispatch => {
  const id = uuid.v4();
  dispatch({
    type: SET_ETH_ALERT,
    payload: { msg, alertType, id, alertHash }
  });

  setTimeout(() => dispatch({ type: REMOVE_ETH_ALERT, payload: id }), timeout);
};
