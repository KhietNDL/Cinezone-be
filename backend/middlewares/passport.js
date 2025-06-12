const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');
const googleConfig = require('../config/google');

passport.use(new GoogleStrategy(googleConfig,
  async (accessToken, refreshToken, profile, done) => {
    try {
      // search user by GoogleId
      let user = await User.findByGoogleId(profile.id);
      if (!user) {
        // if not exist then create new
        const userData = {
          googleId: profile.id,
          fullName: profile.displayName,
          email: profile.emails[0].value,
          // can add more fields if needed
        };
        const userId = await User.createGoogleUser(userData);
        user = await User.findById(userId);
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.UserId);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport; 