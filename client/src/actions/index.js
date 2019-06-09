import axios from "axios";
import { FETCH_USER } from "./types";

export const fetchUser = () => async (dispatch) => {
	try {
		const response = await axios.get("/auth/me", {
			withCredentials: true
		});
		dispatch({ type: FETCH_USER, payload: response.data });
	} catch (error) {}
};

export const signUp = (body) => async (dispatch) => {
	try {
		const response = await axios.post("/auth/signup", body);
		console.log(response.data);
		dispatch({ type: FETCH_USER, payload: response.data });
	} catch (error) {}
};

export const logIn = (body) => async (dispatch) => {
	const response = await axios.post("/auth/login", body);
	dispatch({ type: FETCH_USER, payload: response.data });
};

export const logOut = () => async (dispatch) => {
	try {
		await axios.post("/auth/logout", {
			withCredentials: true
		});

		dispatch({ type: FETCH_USER, payload: undefined });
	} catch (error) {}
};

export const cancelAccount = () => async (dispatch) => {
	try {
		const response = await axios.delete("/user/delete", {
			withCredentials: true
		});

		dispatch({ type: FETCH_USER, payload: response.data });
	} catch (e) {}
};

export const completeAccount = (body) => async (dispatch) => {
	console.log(body);
	try {
		const response = await axios.patch("/user/complete", body, {
			withCredentials: true
		});
		console.log(response.data);
		dispatch({ type: FETCH_USER, payload: response.data });
	} catch (e) {
		console.log(e.response);
	}
};
