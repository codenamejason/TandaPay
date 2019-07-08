import axios from "axios";
import { FETCH_GROUP } from "./types";
const API_BASE = process.env.REACT_APP_API_BASE;

/**
 * @summary Redux action creator to fetch the user's group
 */
export const fetchGroup = groupID => async dispatch => {
    try {
        const response = await axios.get(API_BASE + "/groups/" + groupID, {
            withCredentials: true,
        });

        dispatch({ type: FETCH_GROUP, payload: response.data });
    } catch (err) {
        console.error(err);
    }
};

/**
 * @summary Redux action creator to create a group
 */
export const createGroup = ({ name, premium }) => async dispatch => {
    try {
        const response = await axios.post(
            API_BASE + "/groups/new",
            { groupName: name, premium },
            { withCredentials: true }
        );

        dispatch({ type: FETCH_GROUP, payload: response.data });
    } catch (err) {
        console.error(JSON.stringify(err));
    }
};
