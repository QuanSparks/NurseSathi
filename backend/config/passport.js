const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { findByEmail, createUser, findById } = require('../services/userService');
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:3000'}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await findByEmail(email);

        if (!user) {
          // Create new user from Google profile — default role 'student', can update in profile
          user = await createUser({
            name: profile.displayName,
            email,
            password: null,
            role: 'student',
            google_id: profile.id,
            avatar: profile.photos?.[0]?.value || null,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
