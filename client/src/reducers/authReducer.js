import {
  FETCH_USER,
  REGISTRATION_FAILED,
  LOGIN_FAILED,
  AUTH_ERROR,
  LOGOUT_SUCCESS
} from "../actions/types";

export default function(state = null, action) {
  switch (action.type) {
    case FETCH_USER:
      return action.payload || false;
    case LOGOUT_SUCCESS:
      return null;

    default:
      return state;
  }
}
