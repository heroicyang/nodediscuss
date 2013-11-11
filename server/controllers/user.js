/**
 * 用户相关的视图控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash'),
  api = require('../../api');

exports.signup = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    req.breadcrumbs('注册');
    return res.render('signup');
  }

  if ('post' === method) {
    var data = req.body,
      password = data.password,
      password2 = data.password2;

    if (password !== password2) {
      return next(new Error('Your new passwords do not match.'));
    }

    api.user.create(data, function(err, user) {
      if (err) {
        if (err.name === 'ValidationError') {
          return res.render('signup', {
            errors: _.pluck(_.values(err.errors), 'type')
          });
        } else {
          return next(err);
        }
      }
      res.send(user);
    });
  }
};