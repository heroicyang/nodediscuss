var passport = require('passport'),
  api = require('../../api');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  api.user.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = exports = passport;