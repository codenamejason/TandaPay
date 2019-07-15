import axios from "axios";
import { FETCH_GROUP } from "./types";

const API_BASE = process.env.REACT_APP_API_BASE;

/**
 * @summary generates the options to use with a request. this is a function
 *          and not a const because the document.cookie may change
 */
function config() {
    return {
        baseURL: API_BASE,
        headers: {
            Authorization:
                "Bearer " + document.cookie.match(/x-auth=(\S+)/)[1],
        },
    };
}

/**
 * @summary Redux action creator to fetch the user's group
 */
export const fetchGroup = () => async dispatch => {
    try {
        const profile = await axios.get("/user/profile", config());
        let { groupID } = profile.data;

        if (!groupID) {
            dispatch({ type: FETCH_GROUP, payload: { _id: null } })
        }

        const group = await axios.get("/groups/" + groupID, config());
        dispatch({ type: FETCH_GROUP, payload: group.data });
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
            "/groups/new",
            { groupName: name, premium },
            config()
        );

        dispatch({ type: FETCH_GROUP, payload: response.data });
    } catch (err) {
        console.error(JSON.stringify(err));
    }
};
