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

/**
 * @summary Allows a user to create an account through email/password. It allows both users and secretaries to sign up.
 * It'll return an error if an user already exists or the input is malformed.
 * @param email
 * @param password
 * @todo Allow user to sign up as a secretary or regular user
 */
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const body = { name, email, password };

  //checks for existing user
  const existingUser = await User.findOne({
    email
  });
  if (existingUser) {
    return res.status(422).send({
      error: "Email already in use"
    });
  }
  const user = new User(body);
  try {
    const token = await user.generateAuthToken("user");
    await user.save();
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
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.header("x-auth", token).send(user);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

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
 * @todo delete the token in the database to fully signout the user
 */
router.post("/logout", authenticated, async (req, res) => {
  //logout
  const user = req.user;
  const token = req.token;
  try {
    await user.removeToken(token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
