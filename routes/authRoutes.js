const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const User = mongoose.model("users");

const {
  authenticated,
  userDoesNotExist
} = require("../middleware/authenticated");
let router = express.Router();

/**
 *
 */
router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"]
  })
);

/**
 * @todo - From the received user profile(given by google and processed by passport.js).
 * Attempt to save the user profile and create an auth token
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const { name, email, picture, googleID } = req.user;
    const body = { name, email, picture, googleID };
    const user = new User(body);
    try {
      const token = await user.generateAuthToken("user");
      await user.save();
      res.cookie("x-auth", token, {
        maxAge: 9000000000,
        httpOnly: true,
        secure: true
      });
      res.redirect("/");
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

/**
 * @summary Allows a user to create an account through email/password. It allows both users and secretaries to sign up.
 * It'll return an error if an user already exists or the input is malformed.
 * @param email
 * @param password
 * @todo Allow user to sign up as a secretary or regular user
 */
router.post("/signup", userDoesNotExist, async (req, res) => {
  const { name, email, password } = req.body;
  const body = { name, email, password };

  const user = new User(body);
  try {
    const token = await user.generateAuthToken("user");
    await user.save();
    const { email, name } = user;

    res.cookie("x-auth", token, {
      maxAge: 9000000000,
      httpOnly: true,
      secure: true
    });
    res.send({ token, email, name });
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * @summary
 * @param email
 * @param password
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({
      error: "User did not provide all appropriate credentials"
    });
  }

  try {
    const user = await User.findByCredentials(email, password);

    if (!user) {
      return res
        .status(400)
        .send({ error: "User with given credentials not found" });
    }
    const token = await user.generateAuthToken("user");
    const { name } = user;
    res.cookie("x-auth", token, {
      maxAge: 9000000000,
      httpOnly: true,
      secure: true
    });
    res.send({ token, email, name });
  } catch (e) {
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
    res.cookie("x-auth", "", { maxAge: Date.now() });
    res.status(200).send({ success: "You have been logged out successfully" });
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
