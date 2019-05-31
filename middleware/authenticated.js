const mongoose = require("mongoose");

const User = mongoose.model("users");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
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
    .then(user => {
      if (!user) {
        return Promise.reject();
      }
      req.user = user;
      req.token = token;
      next();
    })
    .catch(e => {
      return res.status(401).send({
        error: "Invalid credentials provided. Acquire new credentials."
      });
    });
};

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

let userDoesExist = async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await User.findByCredentials(email, password);

  if (!existingUser) {
    return res.status(409).send({
      error: "User with given credentials not found"
    });
  }
  const { name } = existingUser;
  req.body = { email, password, name };
  next();
};

module.exports = {
  authenticated,
  userDoesNotExist,
  userDoesExist
};
