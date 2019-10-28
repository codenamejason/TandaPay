import axios from "axios";
import { setAlert } from "./alert";
import { FETCH_CLAIMS, ENABLE_WEB3, CLAIM_CREATED } from "./types";

import claimsData from "../data/claims.json";
import { attemptConnection, createDAIContract, groupContract } from "../web3";

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

export const fetchClaims = () => async dispatch => {
  try {
    const rs = await axios.get("/claims/", config());
    const claims = rs.data;

    dispatch({ type: FETCH_CLAIMS, payload: claims });
  } catch (error) {}
};

export const createClaim = (summary, documents, amount) => async dispatch => {
  try {
    const rs = await axios.post(
      "/claims/",
      { summary, documents, amount },
      config()
    );
    const claims = rs.data;
    // dispatch({ type: CLAIM_CREATED });
    dispatch(setAlert("claim created successfully", "success"));
    dispatch({ type: FETCH_CLAIMS, payload: claims });
  } catch (err) {
    console.log(err);

    const error = err.response.data.error;

    if (error) {
      dispatch(setAlert(error, "danger"));
    }
    console.log(error.response);
  }
};

export const approveClaim = claim_id => async dispatch => {
  try {
    const rs = await axios.post(
      "/claims/" + claim_id + "/approve",
      {},
      config()
    );
    const getClaims = await axios.get("/claims/", config());
    const claims = getClaims.data;

    dispatch({ type: FETCH_CLAIMS, payload: claims });
  } catch (err) {
    // console.log(err);
    // const error = err.response.data.error;
    // if (error) {
    //   dispatch(setAlert(error, "danger"));
    // }
    // console.log(error.response);
  }
};

export const denyClaim = claim_id => async dispatch => {
  try {
    const rs = await axios.post("/claims/" + claim_id + "/deny", {}, config());
    const getClaims = await axios.get("/claims/", config());
    const claims = getClaims.data;

    dispatch({ type: FETCH_CLAIMS, payload: claims });
  } catch (err) {
    // console.log(err);
    // const error = err.response.data.error;
    // if (error) {
    //   dispatch(setAlert(error, "danger"));
    // }
    // console.log(error.response);
  }
};
// export const createClaim = (summary, files) => async dispatch => {
//   try {
//     const claims = await axios.post(
//       "/groups/subgroup",
//       { subName: name, group_id },
//       config()
//     );

//     dispatch(setAlert("Created successfully", "success"));
//     dispatch({ type: FETCH_CLAIMS, payload: claims });
//   } catch (err) {
//     console.log(err.response.data.error);
//     const error = err.response.data.error;

//     if (error) {
//       dispatch(setAlert(error, "danger"));
//     }
//   }
// };

/**
 * @summary
 * @param {Function} dispatch
 * @param {Function} getState
 * ! @todo Add the other contracts to the redux store object
 */
export const connectWeb3 = () => async (dispatch, getState) => {
  try {
    const { user } = getState();
    const web3 = await attemptConnection(user);
    const DAI = createDAIContract(web3);
    const TGP = groupContract(web3);
    dispatch({ type: ENABLE_WEB3, payload: { web3, DAI, TGP } });
  } catch (error) {
    console.log(error);
  }
};

/**
 * @summary
 * @param {Function} dispatch
 * @param {Function} getState
 */
export const changeProvider = () => async (dispatch, getState) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

export {
  fetchUser,
  signUp,
  logIn,
  logOut,
  cancelAccount,
  completeAccount,
  updateWallet,
  updateSettings
} from "./user";

export { fetchGroup, createGroup, inviteMember } from "./group";
