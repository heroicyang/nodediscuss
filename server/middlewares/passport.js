var async = require('async'),
  passport = require('passport'),
  api = require('../api');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  async.waterfall([
    function getUser(next) {
      api.User.get({
        _id: id
      }, next);
    },
    function getUnreadNotifyCount(user, next) {
      if (!user) {
        return next(null, user);
      }
      api.Notification.getCount({
        userId: user.id,
        read: false
      }, function(err, count) {
        if (err) {
          return next(err);
        }
        user.unreadNotificationCount = count;
        next(null, user);
      });
    }
  ], function(err, user) {
    done(err, user);
  });
});

module.exports = exports = passport;