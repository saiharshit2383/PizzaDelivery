const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

function init(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' }, // Specify email as the username field
      async (email, password, done) => {
        try {
          // Login
          // Check if email exists
          const user = await User.findOne({ email: email });
          if (!user) {
            return done(null, false, { message: 'No user with this email' });
          }

          // Compare password
          const match = await bcrypt.compare(password, user.password);
          if (match) {
            return done(null, user, { message: 'Logged in successfully' });
          } else {
            return done(null, false, { message: 'Wrong username or password' });
          }
        } catch (err) {
          console.error(err); // Log error for debugging
          return done(null, false, { message: 'Something went wrong' });
        }
      }
    )
  );

  // Serialize user to store in session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}

module.exports = init;
