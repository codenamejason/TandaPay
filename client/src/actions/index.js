import axios from "axios";
import { FETCH_USER } from "./types";

export const fetchUser = () => async dispatch => {
  //pull token from header
  const token = localStorage.getItem("x-auth");
  const response = await axios.get("/auth/user", {
    headers: {
      "x-auth": token
    }
  });
  dispatch({ type: FETCH_USER, payload: response });
};

export const signUp = body => async dispatch => {
  const response = await axios.post("/auth/signup", body);

  localStorage.setItem("x-auth", response.data.token);
  dispatch({ type: FETCH_USER, payload: response.data });
};

export const logIn = body => async dispatch => {
  const response = await axios.post("/auth/login", body);

  localStorage.setItem("x-auth", response.data.token);
  dispatch({ type: FETCH_USER, payload: response.data });
};

export const logOut = () => async dispatch => {
  const token = localStorage.getItem("x-auth");
  console.log(token);
  try {
    const response = await axios.post(
      "/auth/logout",
      {},
      {
        headers: {
          "x-auth": token
        }
      }
    );

    localStorage.removeItem("x-auth");
    dispatch({ type: FETCH_USER, payload: response.data });
    window.location.reload();
  } catch (error) {
    console.log(error.response.data);
  }
};
