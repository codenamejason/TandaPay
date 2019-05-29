const mongoose = require("mongoose");

const User = mongoose.model("users");

let authenticated = (req, res, next) => {
  const token = req.header("x-auth");
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
      res.status(401).send();
    });
};

let userDoesNotExist = async (req, res, next) => {
  const { email } = req.body;

  //checks for existing user
  const existingUser = await User.findOne({
    email
  });
  if (existingUser) {
    return res.status(403).send({
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
