const mongoose = require("mongoose");
const User = mongoose.model("users");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
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
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();

    next();
  } catch (error) {
    res.status(400).send(error);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const generateToken = async (req, res, next) => {
  const { email, name } = req.body;
  const user = await User.findOne({ email });
  try {
    const token = await user.generateAuthToken("user");
    req.token = token;
    req.user = { name, email };
    next();
  } catch (e) {
    res.status(400).send(e);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
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

const logOut = async (req, res, next) => {
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
};
/**
 *
 * @param {req.token and req.user} req - req.user may not be defined so it must be checked
 * @param {*} res
 */
const sendCookie = async (req, res) => {
  const token = req.token;
  res.cookie("x-auth", token, {
    maxAge: 9000000000,
    httpOnly: true,
    secure: false
  });

  if (req.user) {
    const { email, name } = req.user;
    return res.send({ token, email, name });
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
  logOut
};
