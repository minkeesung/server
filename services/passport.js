const passport = require('passport')
const User = require('../models/user')
const config = require('../config')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local')

// Create local Strategy, local database
// tell localstrategy to user usernamefield of Email
const localOptions = { usernameField: 'email' }
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // verify username and password, call done with the user if it is the correct username and password
  // otherwise, call done with false
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    // compare passwords - is user password equal to password
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user)
    })
  })
})

// Setup options for JWT Strategy

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
}

// look at request header, header called authorization to find token

//  Create JWT JwtStrategy
// done callback is supplied by passport, takes user and supplies is w/ req.user
// req.user is user object
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // payload is decoded jwt token, this decoded token will have sub property and issued at property
  // done is a callback function
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that user
  // otherwise, call done without the user object
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false)}

    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  })
})

// Strategy is part of passport ecosystem and is used to authenticate users

//  Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
