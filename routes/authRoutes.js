const express = require("express");
const passport = require("passport");

const { authenticated } = require("../middleware/authenticated");

const {
	oauthController,
	generateToken,
	sendCookie,
	checkCredentials,
	createUser,
	logOut,
	userDoesExist,
	userDoesNotExist
} = require("../controller/authController");
let router = express.Router();

/**
 * @summary
 */
router.get(
	"/google",
	passport.authenticate("google", {
		session: false,
		scope: ["profile", "email"]
	})
);

/**
 * @summary
 * @callback
 * @returns the cookie with the token and redirects the user back to the application
 */
router.get(
	"/google/callback",
	passport.authenticate("google", { session: false, failureRedirect: "/" }),
	oauthController,
	async (req, res) => {
		const token = req.token;
		res.cookie("x-auth", token, {
			maxAge: 9000000000,
			httpOnly: true,
			secure: false
		});
		res.redirect("/");
	}
);

/**
 * @summary
 */
router.get(
	"/facebook",
	passport.authenticate("facebook", {
		session: false,
		scope: ["email"]
	})
);

/**
 * @summary
 */
router.get(
	"/facebook/callback",
	passport.authenticate("facebook", {
		session: false
	}),
	oauthController,
	async (req, res) => {
		res.cookie("x-auth", req.token, {
			maxAge: 9000000000,
			httpOnly: true,
			secure: false
		});
		res.redirect("/");
	}
);

/**
 * @summary Allows a user to create an account through email/password. It allows both users and secretaries to sign up.
 * It'll return an error if an user already exists or the input is malformed.
 * @param email
 * @param password
 * @todo Allow user to sign up as a secretary or regular user
 */
router.post("/signup", userDoesNotExist, createUser, generateToken, sendCookie);

/**
 * @summary
 * @param email
 * @param password
 */
router.post(
	"/login",
	checkCredentials,
	userDoesExist,
	generateToken,
	sendCookie
);
/**
 * @summary retrieves the full information about the user and sends it back as a response
 * @param token identifier to determine which user to retrieve
 */
router.get("/user", authenticated, (req, res) => {
	//check for user
	res.send(req.user);
});

/**
 * @summary
 * @param token
 */
router.post("/logout", authenticated, logOut);

module.exports = router;
