import { FETCH_PREMIUM } from "../actions/types";

export default function(state = null, action) {
  switch (action.type) {
    case FETCH_PREMIUM:
      return action.payload || null;

    default:
      return state;
  }
}
