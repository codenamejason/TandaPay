const mongoose = require("mongoose");
const User = mongoose.model("users");

/**
 *
 * @param {body} req
 * @param {*} res
 * @param next - Express callback function that will forward the route to the next controller
 * @todo Move the function to the controller folder
 */
let userDoesNotExist = async (req, res, next) => {
	const { email } = req.body;

	//checks for existing user
	const existingUser = await User.findOne({
		email
	});
	if (existingUser) {
		return res.status(409).send({
			errors: {
				email: "Email already in use."
			}
		});
	}

	next();
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param next - Express callback function that will forward the route to the next controller
 * @todo Append the user model to the request model
 * @todo Move the function to the controller folder
 */
let userDoesExist = async (req, res, next) => {
	const { email, password } = req.body;

	const existingUser = await User.findByCredentials(email, password);
	if (!existingUser) {
		return res.status(409).send({
			error: "User with given credentials not found"
		});
	}
	const { name, role } = existingUser;
	req.body = { email, password, name, role };
	next();
};
/**
 * @summary - It will receive the response from the Oauth Provider Passportjs Strategy, with the user json provided as part of the request.
 * It will then either log the user in or sign them up depending on whether they're a preexisting user or not. If an error occurs it will respond with a 400 error
 * @param {user: {email, name, oauthID, ...}}  req - the req parameter will have the user's name, email and oauthID.
 * It may optionally provide other relevant user data depending on the Oauth Provider
 * @param res - The res parameter will remain unchanged if the Oauth 2.0 authentication attempt is successful
 * @param next - Express callback function that will forward the route to the next controller
 *
 */
const oauthController = async (req, res, next) => {
	const existingUser = await User.findOne({ email: req.user.email });
	try {
		if (existingUser) {
			const token = await existingUser.generateAuthToken("user");
			req.token = token;
			next();
		} else {
			const user = new User(req.user);
			const token = await user.generateAuthToken("user");
			await user.save();
			req.token = token;
			next();
		}
	} catch (e) {
		res.status(400).send(e);
	}
};

/**
 * @summary The create user controller will be called after the credentials have been checked for both validity and uniqueness.
 * The controller will create a new User object and save it to the database. Once that is done, it will forward the request to the next controller.
 * @param {body:  {name, email, password}} req - receives the approved credentials from checkCredentials
 * @param res - The res parameter will remain unchanged if the user was created and saved properly, otherwise it'll return a 400 error
 * @param next - Express callback function that will forward the route to the next controller
 * @todo Add user model to the request parameters
 */
const createUser = async (req, res, next) => {
	const { name, email, password, role } = req.body;
	if (role === "admin") {
		return res.status(400).send({
			error: "Cannot create admin account"
		});
	}
	const status = role === "policyholder" ? "approved" : "pending";
	try {
		const user = new User({ name, email, password, role, status });
		await user.save();
		next();
	} catch (error) {
		res.status(400).send(error);
	}
};

/**
 * @summary It will take the user's email to generate a new auth token from the user model.
 * It will then add the token and user data to the request and forward it to the next controller
 * @param {body: {email, name}} req
 * @param res - The res parameter will remain unchanged if the user's auth token was regenerated properly.
 * @param next - Express callback function that will forward the route to the next controller
 */
const generateToken = async (req, res, next) => {
	const { email, name, role } = req.body;
	const user = await User.findOne({ email });
	try {
		const token = await user.generateAuthToken(role);
		req.token = token;
		req.user = { name, email };
		next();
	} catch (e) {
		res.status(400).send(e);
	}
};

/**
 * @summary - The checkCredentials controller will check that both the email and password have been properly provided.
 * @param {body} req - The req parameter will receive the user's email and password
 * @param res - The res parameter will remain unchanged if the user provides the proper credentials
 * @param next - Express callback function that will forward the route to the next controller
 */
const checkCredentials = async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).send({
			error: "User did not provide all appropriate credentials"
		});
	} else {
		return next();
	}
};

/**
 * @summary - The logOut controller will receive the user model and the auth token.
 * It will then remove the token from the user model and user's cookie used for authentication.
 * @param {user, token} req - It will receive the user model and auth token through the request body
 * @param {*} res - It will have the x-auth cookie removed, and respond with a 200 success response.
 * If there is an issue removing the token and/or the cookie.
 */
const logOut = async (req, res) => {
	const user = req.user;
	const token = req.token;
	try {
		await user.removeToken(token);
		res.cookie("x-auth", "", { maxAge: Date.now() });
		res.status(200).send({ success: "You have been logged out successfully" });
	} catch (e) {
		res.status(400).send(e);
	}
};
/**
 * @summary - The sendCookie controller will receive the user auth token.
 * Depending on the former controllers, it will either send the user model alongside the request, or just the auth token.
 * @param {token, user} req - req.user may not be defined so it must be checked
 * @param res The res token will have the new auth cookie(and 200 status code) in the event of success.
 * Otherwise it will return a 400 error code
 * @todo Add oauth boolean value to req parameter to include in oauth provider auth flow.
 */
const sendCookie = async (req, res) => {
	const token = req.token;
	res.cookie("x-auth", token, {
		maxAge: 9000000000,
		httpOnly: true,
		secure: false
	});

	if (req.user) {
		const { email, name, status } = req.user;
		return res.send({ token, email, name, status });
	} else {
		return res.send();
	}
};

module.exports = {
	oauthController,
	sendCookie,
	generateToken,
	checkCredentials,
	createUser,
	logOut,
	userDoesExist,
	userDoesNotExist
};
