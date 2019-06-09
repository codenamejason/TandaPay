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
	userDoesNotExist
} = require("../controller/authController");
let router = express.Router();

/**
 * @summary
 * @todo Allow for user form submissions
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
 * @summary retrieves the full information about the user and sends it back as a response
 * @param token identifier to determine which user to retrieve
 */
router.get("/user", checkSignature, authenticated, (req, res) => {
	//check for user
	const token = req.token;
	const {
		email,
		name,
		status,
		accountCompleted,
		role,
		walletProvider,
		picture,
		phone,
		ethereumAddress,
		settings
	} = req.user;
	return res.send({
		token,
		email,
		name,
		status,
		accountCompleted,
		role,
		walletProvider,
		picture,
		phone,
		ethereumAddress,
		settings
	});
});

/**
 * @summary
 * @param token
 */
router.post("/logout", checkSignature, authenticated, logOut);

/**
 * @summary retrieves the absolute basic user information.
 * It will will only check for the validity of the token information
 * @param token
 */

router.get("/", checkSignature, (req, res) => {
	const user = req.body;
	res.status(200).send(user);
});

module.exports = router;
