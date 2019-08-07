// import axios from "axios";
import { FETCH_CLAIMS } from "./types";

import claimsData from "../data/claims.json";

export const fetchClaims = () => async dispatch => {
  try {
    const claims = claimsData.claims;
    dispatch({ type: FETCH_CLAIMS, payload: claims });
  } catch (error) {}
};

export const createClaim = (summary, files) => async dispatch => {
  try {
    const claims = claimsData.claims;
    console.log("created claim");
    dispatch({ type: FETCH_CLAIMS, payload: claims });
  } catch (error) {}
};

export const connectWeb3 = () => async dispatch => {
  try {
    
  } catch (error) {
    console.log(error);
  }
}

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
