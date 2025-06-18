const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');
const googleConfig = require('../config/google');

passport.use(new GoogleStrategy(googleConfig,
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;

      // 1. Tìm người dùng theo GoogleId. Nếu tìm thấy, đăng nhập.
      let user = await User.findByGoogleId(profile.id);
      if (user) {
        return done(null, user);
      }

      // 2. Nếu không tìm thấy theo GoogleId, kiểm tra xem email đã tồn tại chưa.
      const existingUserByEmail = await User.findByEmail(email);

      if (existingUserByEmail) {
        // Email đã được sử dụng bởi một tài khoản khác (có thể là tài khoản cục bộ hoặc tài khoản Google khác).
        return done(null, false, { message: 'Email này đã được đăng ký với một tài khoản khác.' });
      }

      // 3. Nếu email chưa được sử dụng, tạo tài khoản Google mới.
      const userData = {
        googleId: profile.id,
        fullName: profile.displayName,
        email: email,
        // có thể thêm các trường khác nếu cần
      };
      const userId = await User.createGoogleUser(userData);
      user = await User.findById(userId);
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