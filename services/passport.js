const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID_DEV,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET_DEV,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    console.log({ accessToken, refreshToken, profile });
}));