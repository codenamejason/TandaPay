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
  const token = req.header("x-auth");
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

module.exports = {
  authenticated,
  userDoesNotExist
};
