const express = require("express");
const User = require("../models/User");
const {
	checkSetupSettings,
	saveUpdates,
	generateUpdatedToken
} = require("../controller/userController");
const { authenticated } = require("../middleware/authenticated");
let router = express.Router();

/**
 * @summary Adds the role, groupID/accessCode, walletProvider and ethAddress to the user
 * and sends back a new auth token that says their account is complete.
 */
router.patch(
	"/complete",
	checkSetupSettings,
	authenticated,
	saveUpdates,
	generateUpdatedToken,
	async (req, res) => {
		const token = req.token;
		res.cookie("x-auth", token, {
			maxAge: 9000000000,
			httpOnly: true,
			secure: false
		});

		if (req.user) {
			const { email, name, status, accountCompleted } = req.user;
			return res.send({ token, email, name, status, accountCompleted });
		} else {
			return res.send();
		}
	}
);

router.delete("/delete", authenticated, async (req, res) => {
	const user = req.user;
	try {
		await User.findByIdAndDelete(user._id);
		res.cookie("x-auth", "", { maxAge: Date.now() });
		res.status(200).send();
	} catch (e) {
		res.status(400).send(e);
	}
});

module.exports = router;
