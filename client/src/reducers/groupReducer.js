import { FETCH_GROUP } from "../actions/types";

export default function(state = null, action) {
	switch (action.type) {
		case FETCH_GROUP:
			return action.payload || false;
		default:
			return state;
	}
}
