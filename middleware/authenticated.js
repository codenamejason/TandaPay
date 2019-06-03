const mongoose = require("mongoose");

const User = mongoose.model("users");

/**
 * @summary - It will retrieve the auth token cookie from the request.
 * It will then process the token to check for validity and forward the user to the route controller if it is. Otherwise it will respond with a 401 Error.
 * @param {token} req - It will receive the auth token through a cookie.
 * The token and user object will be defined in the request object if the user is authenticated
 * @param res - Will be unchanged if the user is authenticated, the request will be forwarded to the route controllers.
 * @param next - Express callback function that will forward the route to the next controller
 * @todo add WWWW-Authenticate Header as specified by the RFC
 */
let authenticated = (req, res, next) => {
	const token = req.cookies["x-auth"];
	if (!token) {
		return res.status(401).send({
			error: "User must be logged in"
		});
	}
	User.findByToken(token)
		.then((user) => {
			if (!user) {
				return Promise.reject();
			}
			req.user = user;
			req.token = token;
			next();
		})
		.catch((e) => {
			return res.status(401).send({
				error: "Invalid credentials provided. Acquire new credentials."
			});
		});
};

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

module.exports = {
	authenticated,
	userDoesNotExist,
	userDoesExist
};
