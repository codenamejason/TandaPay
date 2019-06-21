import axios from "axios";
import { FETCH_GROUP } from "./types";

import group from "../data/group.json";

export const fetchGroup = () => async dispatch => {
	dispatch({ type: FETCH_GROUP, payload: group });
};

export const createGroup = ({ name, premium }) => async dispatch => {
	const response = await axios.post("/group/new", { name, premium });
	dispatch({ type: FETCH_GROUP, payload: group });
};
