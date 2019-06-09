const express = require("express");
const passport = require("passport");

const {
	authenticated,
	checkSignature
} = require("../middleware/authenticated");

const {
	oauthController,
	generateToken,
	sendCookie,
	checkCredentials,
	createUser,
	logOut,
	userDoesExist,
	userDoesNotExist,
	sendProfile
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
 * @param {Object} token
 * @returns the cookie with the token and redirects the user back to the application
 */
router.get(
	"/google/callback",
	passport.authenticate("google", { session: false, failureRedirect: "/" }),
	oauthController,
	sendCookie
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
	sendCookie
);

/**
 * @summary Allows a user to create an account through email/password. It allows both users and secretaries to sign up.
 * It'll return an error if an user already exists or the input is malformed.
 * @param email
 * @param password
 * @param name
 * @param role
 * @todo Require a user to provide a group access code
 */
router.post(
	"/signup",
	checkCredentials,
	userDoesNotExist,
	createUser,
	generateToken,
	sendCookie
);

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
 * @summary
 * @param token
 */
router.post("/logout", checkSignature, authenticated, logOut);

/**
 * @summary retrieves the absolute basic user information.
 * It will will only check for the validity of the token information
 * @param {Object} token - the encoded token received and validated
 * @param {Object} user - the decoded user information from the token
 */

router.get("/me", checkSignature, (req, res) => {
	const user = req.body;
	res.status(200).send(user);
});

module.exports = router;
