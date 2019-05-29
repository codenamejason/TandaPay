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
  console.log(response.data.token);
  localStorage.setItem("x-auth", response.data.token);
  dispatch({ type: FETCH_USER, payload: response.data });
};
