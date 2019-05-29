const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const keys = require("../config/keys");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: [
      {
        validator: value => {
          return validator.isEmail(value);
        },
        message: "{VALUE} is not a valid email."
      }
    ]
  },
  phone: {
    type: String,
    required: false,
    trim: true,
    validate: [
      {
        validator: value => {
          return validator.isMobilePhone(value);
        },
        message: "{VALUE} is not a valid phone number."
      }
    ]
  },
  password: {
    type: String,
    required: () => {
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
        required: true
      },
      token: {
        type: String,
        required: true
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
 * @todo invalidate old tokens
 */
userSchema.methods.generateAuthToken = async function(accessLevel) {
  const user = this;
  const access = "auth";
  let token = jwt.sign(
    { sub: user._id.toHexString(), access, accessLevel },
    keys.jwtSecret
  );
  // const res = await user.update({
  //   $pull: {
  //     tokens: {
  //       access: access
  //     }
  //   }
  // });
  // console.log(res);
  user.tokens = user.tokens.concat([{ access, token }]);
  await user.save();
  return token;
};

/**
 * @summary
 * @param token - the auth token that a user is provided when they log in
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
    _id: decoded.sub,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

/**
 * @summary
 * @param email
 * @param password
 * @this User - refers to the User Schema itself, not any given instance. This function will be called statically
 * @returns
 */
userSchema.statics.findByCredentials = async function(email, password) {
  var User = this;

  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }
  const res = await bcrypt.compare(password, user.password);
  //if passwords match
  if (res) {
    return user;
  } else {
    return null;
  }
};

/**
 * @todo Transition away from update if possible(deprecated)
 */
userSchema.methods.removeToken = function(token) {
  var user = this;
  return user.update({
    $pull: {
      tokens: {
        token: token
      }
    }
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

module.exports = mongoose.model("users", userSchema);
