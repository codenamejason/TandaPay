import { SET_ETH_ALERT, REMOVE_ETH_ALERT } from "../actions/types";

const initialState = [];

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ETH_ALERT:
      return [...state, payload];
    case REMOVE_ETH_ALERT:
      return state.filter(alert => alert.id !== payload);
    default:
      return state;
  }
}
