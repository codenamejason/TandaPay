const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const keys = require("../config/keys");

const userSchema = new Schema({
  name: {
    type: String,
    require: true,
    trim: true
  },
  email: {
    type: String,
    require: true,
    trim: true,
    validate: [
      {
        validator: value => validator.isEmail(value),
        message: "{VALUE} is not a valid email"
      }
    ]
  },
  phone: {
    type: String,
    require: false,
    trim: true,
    validate: [
      {
        validator: value => validator.isMobilePhone(value),
        message: "{VALUE} is not a valid phone number"
      }
    ]
  },
  password: {
    type: String,
    require: () => {
      return this.googleId !== "" || this.twitterId !== "";
    },
    trim: true,
    minlength: 8
  },
  googleId: String,
  twitterId: String,
  tokens: [
    {
      access: {
        type: String,
        require: true
      },
      token: {
        type: String,
        require: true
      }
    }
  ]
});

/**
 * @summary Schema Method that generates the authentication token based on the user's access level.
 * It will concatenate the token to the User model and saves it
 * @param accessLevel - the access level of the user: user, secretary, admin
 * @this user refers to the instance of the user schema that called the specific method
 * @returns the auth token generated for the user
 */
userSchema.methods.generateAuthToken = async function(accessLevel) {
  const user = this;
  const access = "auth";
  console.log(user);
  let token = jwt.sign(
    { _id: user._id.toHexString(), access, accessLevel },
    keys.jwtSecret
  );

  user.tokens = user.tokens.concat([{ access, token }]);
  await user.save();
  return token;
};

/**
 * @summary
 * @param token -
 * @this User - refers to the User Schema itself, not any given instance. This function will be called statically
 */
userSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, keys.jwtSecret);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

/**
 * @summary
 * @param email
 * @param password
 * @returns
 */
userSchema.statics.findByCredentials = async function(email, password) {
  var User = this;

  const user = await User.findOne({ email });

  return new Promise((resolve, reject) => {
    // user input password, previous hashed password
    bcrypt.compare(password, user.password, (err, res) => {
      if (res) {
        return resolve(user);
      } else {
        reject();
      }
    });
  });
};

/**
 * @summary
 */
userSchema.pre("save", function(next) {
  var user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

mongoose.model("users", userSchema);
