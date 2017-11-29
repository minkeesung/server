const jwt = require('jwt-simple')
const User = require('../models/user')
const config = require('../config')

// takes user's id and encodes it with a secret
function tokenForUser(user) {
  return jwt.encode({ }, config.secret)
}

exports.signup = function(req, res, next) {
  const email = req.body.email
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and pasword'});
  }
  // See if a user with a given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err)}

    // If a user with email does exist, return an Error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use'})
    }

    // If a user with email does NOT exist, create and save user record
    const user = new User({
      email: email,
      password: password
    })

    user.save(function(err) {
      if (err) { return next(err)}

      res.json({success: true});
    });
  })



  // If a user with email does NOT exist, create and save user record

  // Respond to request indicating the user was created
}
