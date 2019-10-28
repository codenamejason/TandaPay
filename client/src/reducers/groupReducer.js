import {
  FETCH_GROUP,
  FETCH_USER,
  CREATE_SUBGROUP_SUCCESS
} from "../actions/types";

export default function(state = null, action) {
  switch (action.type) {
    case CREATE_SUBGROUP_SUCCESS:
    case FETCH_GROUP:
      return action.payload || null;
    case FETCH_USER:
      return null;

    default:
      return state;
  }
}
