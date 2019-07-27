import axios from "axios";
import { FETCH_USER } from "./types";

/**
 * @summary
 */
export const fetchUser = () => async dispatch => {
  try {
    const response = await axios.get("/auth/me", {
      withCredentials: true
    });
    dispatch({ type: FETCH_USER, payload: response.data });
  } catch (error) {}
};

/**
 * @summary
 */
export const signUp = body => async dispatch => {
  try {
    const response = await axios.post("/auth/signup", body);
    dispatch({ type: FETCH_USER, payload: response.data });
  } catch (error) {}
};

/**
 * @summary
 * @param {Object} body
 */
export const logIn = body => async dispatch => {
  const response = await axios.post("/auth/login", body);
  dispatch({ type: FETCH_USER, payload: response.data });
};

/**
 * @summary
 */
export const logOut = () => async dispatch => {
  try {
    await axios.post("/auth/logout", {
      withCredentials: true
    });

    dispatch({ type: FETCH_USER, payload: undefined });
  } catch (error) {
    console.error(error);
  }
};

// * USER ROUTES!!!
/**
 * @summary
 */
export const cancelAccount = () => async dispatch => {
  try {
    await axios.delete("/user/delete", { withCredentials: true });

    dispatch({ type: FETCH_USER, payload: null });
  } catch (e) {}
};

/**
 * @summary
 * @param {Object} body
 */
export const completeAccount = body => async dispatch => {
  try {
    const response = await axios.patch("/user/complete", body, {
      withCredentials: true
    });
    dispatch({ type: FETCH_USER, payload: response.data });
  } catch (e) {
    console.log(e.response);
  }
};

/**
 * @summary
 * @param {Object} body
 */
export const updateWallet = body => async dispatch => {
  const { provider, ethAddress } = body;
  try {
    const url = `/user/wallet`;
    const response = await axios.patch(
      url,
      { provider, ethAddress },
      {
        withCredentials: true
      }
    );
    dispatch({ type: FETCH_USER, payload: response.data });
  } catch (e) {
    console.log(e);
  }
};

/**
 * @summary
 * @param {Object} body
 */
export const updateSettings = body => async dispatch => {
  try {
    const { name, email, password, phone } = body;
    const url = `/user/profile`;
    const response = await axios.patch(
      url,
      { name, email, password, phone },
      {
        withCredentials: true
      }
    );
    dispatch({ type: FETCH_USER, payload: response.data });
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};
