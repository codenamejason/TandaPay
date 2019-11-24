import axios from "axios";
import { setAlert } from "./alert";
import { setEthAlert } from "./ethAlert";
import {
  FETCH_GROUP,
  INVITE_MEMBER,
  CREATE_SUBGROUP_FAILED,
  CREATE_SUBGROUP_SUCCESS,
  FETCH_PREMIUM
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

    if (!groupID) {
      return dispatch({ type: FETCH_GROUP, payload: { _id: null } });
    }

    const group = await axios.get("/groups/" + groupID, config());

    dispatch({ type: FETCH_GROUP, payload: group.data });
  } catch (err) {
    console.error(err);
  }
};

/**
 * @summary Redux action creator to fetch the user's group
 */
export const fetchPremiums = () => async dispatch => {
  try {
    const premiums = await axios.get("/groups/fetchpremiums", config());
    console.log(premiums);

    dispatch({ type: FETCH_PREMIUM, payload: premiums.data });
  } catch (err) {
    console.error(err);
  }
};

/** */
export const checkAccessCode = ({ accessCode }) => async dispatch => {
  try {
    let response = await axios.post("/groups/access", { accessCode }, config());
    return response.data;
  } catch (err) {
    return false;
  }
};

export const addGroupContractAddress = contract => async dispatch => {
  try {
    let response = await axios.post(
      "/groups/contract",
      { cAddress: contract },
      config()
    );
    dispatch({ type: FETCH_GROUP, payload: response.data });
    return true;
  } catch (err) {
    return false;
  }
};

export const recordpremiumpayment = (
  groupID,
  user,
  period,
  senderName,
  transactionHash,
  amount
) => async dispatch => {
  try {
    let response = await axios.post(
      "/groups/recordpremiumpayment",
      {
        groupID,
        user,
        period,
        senderName,
        transactionHash,
        amount
      },
      config()
    );
    return true;
  } catch (err) {
    return false;
  }
};
export const removeUserFromSubgroup = () => async dispatch => {
  try {
    let response = await axios.post("/groups/leavesubgroup", {}, config());
    dispatch(setAlert("left successfully", "success"));
    dispatch({ type: CREATE_SUBGROUP_SUCCESS, payload: response.data });
    return true;
  } catch (err) {
    return false;
  }
};

export const lockSubgroup = () => async dispatch => {
  try {
    let response = await axios.post("/groups/lockSubgroup", {}, config());
    dispatch(setAlert("Locked successfully", "success"));
    dispatch({ type: CREATE_SUBGROUP_SUCCESS, payload: response.data });
    return true;
  } catch (err) {
    return false;
  }
};

export const dispatchCustomMessage = ({ msg, type }) => async dispatch => {
  dispatch(setAlert(msg, type));
};

export const dispatchEthCustomMessage = ({
  msg,
  type,
  hash
}) => async dispatch => {
  console.log("hello World");
  dispatch(setEthAlert(msg, type, 30000, hash));
};
/**
 * @summary Redux action creator to create a group
 */

export const createGroup = ({
  name,
  premium,
  fileID,
  ecpm
}) => async dispatch => {
  try {
    const response = await axios.post(
      "/groups/new",
      { groupName: name, premium, charterID: fileID, allowedClaims: ecpm },
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
    dispatch(setAlert("Joined successfully", "success"));
    dispatch({ type: CREATE_SUBGROUP_SUCCESS, payload: group.data });
  } catch (err) {
    //const err; //= err.response.data.error;
    console.log();
    dispatch(setAlert(err.response.data.error, "danger"));

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
  }
};
