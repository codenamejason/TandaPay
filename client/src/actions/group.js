// import axios from "axios";
import { FETCH_GROUP } from "./types";

import group from "../data/group.json";

function hasGroupBeenCreated() {
    return localStorage.groupCreated === "yes";
}

/**
 * @summary Redux action creator to fetch the user's group
 */
export const fetchGroup = () => async dispatch => {
    if (hasGroupBeenCreated()) {
        dispatch({ type: FETCH_GROUP, payload: group });
    } else {
        dispatch({ type: FETCH_GROUP, payload: { mustBeCreated: true } });
    }
};

/**
 * @summary Redux action creator to create a group
 */
export const createGroup = ({ name, premium }) => async dispatch => {
    group.groupName = name;
    group.premium = premium;
    localStorage.groupCreated = "yes";
    dispatch({ type: FETCH_GROUP, payload: group });
};
