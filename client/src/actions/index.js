import axios from "axios";
import { FETCH_CLAIMS } from "./types";
import {
	fetchUser,
	signUp,
	logIn,
	logOut,
	cancelAccount,
	completeAccount
} from "./user";
import data from "../data/data.json";
export const fetchClaims = () => async (dispatch) => {
	try {
		const claims = data.claims;
		dispatch({ type: FETCH_CLAIMS, payload: claims });
	} catch (error) {}
};

export { fetchUser, signUp, logIn, logOut, cancelAccount, completeAccount };
