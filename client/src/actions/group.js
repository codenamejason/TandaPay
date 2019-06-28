// import axios from "axios";
import { FETCH_GROUP } from "./types";

import group from "../data/group.json";

/**
 * @summary Redux action creator to fetch the user's group
 */
export const fetchGroup = () => async dispatch => {
    dispatch({ type: FETCH_GROUP, payload: group });
};

/**
 * @summary Redux action creator to create a group
 */
export const createGroup = ({ name, premium }) => async dispatch => {
    group.groupName = name;
    group.premium = premium;
    dispatch({ type: FETCH_GROUP, payload: group });
};
