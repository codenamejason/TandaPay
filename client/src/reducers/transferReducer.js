import { FETCH_TRANSFERS } from "../actions/types";

export default function(state = null, action) {
  switch (action.type) {
    case FETCH_TRANSFERS:
      return action.payload || null;

    default:
      return state;
  }
}
