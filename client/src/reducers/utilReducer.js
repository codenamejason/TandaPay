import { CLAIM_CREATED, FETCH_OTHER_USER } from "../actions/types";

const inistialState = {
  isCreatClaim: false
};
export default function(state = inistialState, action) {
  switch (action.type) {
    case CLAIM_CREATED:
      return { ...state, isCreatClaim: true };
    case FETCH_OTHER_USER:
      return action.payload;
    default:
      return state;
  }
}
