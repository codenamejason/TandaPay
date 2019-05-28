const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const User = mongoose.model("users");

const authenticated = require("../middleware/authenticated");
let router = express.Router();

// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"]
//   })
// );

// router.get("/google/callback", passport.authenticate("google"), (req, res) => {
//   res.redirect("/admin");
// });

// /**
//  * @summary The login route for email/password. If a valid user,
//  * it will return the user in the vody, and the token in the header
//  */
// router.post("/login", async (req, res) => {
//   const {email, password} = req.body
//   try {
//     const user = await User.findByCredentials(email, password)
//     const token = await user.generateAuthToken()
//     res.header('x-auth', token).send(user)
//   } catch (e) {
//     res.status(400).send()
//   }

//   res.send({});
// });

/**
 * @summary Allows a user to create an account through email/password. It allows both users and secretaries to sign up.
 * It'll return an error if an user already exists or the input is malformed.
 * @param email
 * @param password
 * @todo prevent an user from creating an account with an email that already exists
 * @todo Allow user to sign up as a secretary or regular user
 */
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const body = { email, password };

  const user = new User(body);
  try {
    const token = await user.generateAuthToken("user");
    user.save();
    res.header("x-auth", token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * @summary
 * @param email
 * @param password
 * @todo Check if a user exist
 * @todo Login user if it matches the specification
 */
router.get("/login", async (req, res) => {
  const { email, password } = req.body;
  const body = { email, password };
});

/**
 * @summary
 */
router.get("/user", authenticated, (req, res) => {
  //check for user
  res.send(req.user);
});

router.get("/logout", authenticated, (req, res) => {
  //logout
  res.redirect("/");
});

module.exports = router;
