import axios from "axios";
import { setAlert } from "./alert";
import {
  FETCH_GROUP,
  INVITE_MEMBER,
  CREATE_SUBGROUP_FAILED,
  CREATE_SUBGROUP_SUCCESS
} from "./types";

const API_BASE = process.env.REACT_APP_API_BASE;

/**
 * @summary generates the options to use with a request. this is a function
 *          and not a const because the document.cookie may change
 */
function config() {
  return {
    baseURL: API_BASE,
    headers: {
      Authorization: "Bearer " + document.cookie.match(/x-auth=(\S+)/)[1]
    }
  };
}

/**
 * @summary Redux action creator to fetch the user's group
 */
export const fetchGroup = () => async (dispatch, store) => {
  try {
    let { groupID } = store().user;
    console.log(groupID);
    if (!groupID) {
      console.log(groupID, "Inside the block");
      return dispatch({ type: FETCH_GROUP, payload: { _id: null } });
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
export const createGroup = ({ name, premium, fileID }) => async dispatch => {
  try {
    const response = await axios.post(
      "/groups/new",
      { groupName: name, premium, charterID: fileID },
      config()
    );

    dispatch({ type: FETCH_GROUP, payload: response.data });
  } catch (err) {
    console.error(err);
  }
};

export const JoinSubgroup = ({ value, group_id }) => async dispatch => {
  try {
    const group = await axios.post(
      "/groups/joinsubgroup",
      { sub_id: value, group_id },
      config()
    );
    dispatch(setAlert("Created successfully", "success"));
    dispatch({ type: CREATE_SUBGROUP_SUCCESS, payload: group.data });
  } catch (err) {
    console.log(err.response.data.error);
    const error = err.response.data.error;

    if (error) {
      dispatch(setAlert(error, "danger"));
    }

    dispatch({ type: CREATE_SUBGROUP_FAILED, payload: err });
  }
};

/**
 * @summary Redux action creator to create a sub group
 */
export const creatSubgroup = ({ name, group_id }) => async dispatch => {
  try {
    const group = await axios.post(
      "/groups/subgroup",
      { subName: name, group_id },
      config()
    );
    dispatch(setAlert("Created successfully", "success"));
    dispatch({ type: CREATE_SUBGROUP_SUCCESS, payload: group.data });
  } catch (err) {
    console.log(err, "Subgroup");
    const error = err.response.data.error;

    if (error) {
      dispatch(setAlert(error, "danger"));
    }

    dispatch({ type: CREATE_SUBGROUP_FAILED, payload: err });
  }
};

/**
 * @summary Redux action creator to invite a member
 */
export const inviteMember = email => async (dispatch, store) => {
  try {
    let { groupID } = store().user;

    await axios.post(`/groups/${groupID}/invite`, { email }, config());
    dispatch(setAlert("Invited successfully", "success"));
    dispatch({ type: INVITE_MEMBER, payload: null });
  } catch (err) {
    dispatch(setAlert("Invitation failed", "danger"));
    console.error(err);
  }
};
