var async = require('async'),
  passport = require('passport'),
  api = require('../../api');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  async.waterfall([
    function getUser(next) {
      api.user.get({
        id: id
      }, function (err, user) {
        next(err, user);
      });
    },
    function getUnreadNotifyCount(user, next) {
      if (!user) {
        return next(null, user);
      }
      api.notification.getUnreadCount({
        userId: user.id
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