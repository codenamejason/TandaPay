const keys = require("../config/keys");
const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const { displayName, emails, photos, id } = profile;
      const userEmail = emails[0].value;
      const userPicture = photos[0].value;

      return done(null, {
        name: displayName,
        email: userEmail,
        picture: userPicture,
        googleID: id
      });
    }
  )
);
