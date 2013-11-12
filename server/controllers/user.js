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
    var locals = _.extend({}, req.flash('body'), {
      errors: req.flash('errors')
    });
    req.breadcrumbs('注册');
    return res.render('signup', locals);
  }

  if ('post' === method) {
    api.user.create(req.body, function(err, user) {
      if (err) {
        return next(err);
      }
      res.send(user);
    });
  }
};

exports.signin = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    var locals = _.extend({}, req.flash('body'), {
      errors: req.flash('errors')
    });
    req.breadcrumbs('登录');
    return res.render('signin', locals);
  }

  if ('post' === method) {
    var data = req.body,
      email = data.email,
      password = data.password,
      remember = data.remember;

    api.user.check(email, password, function(err, user) {
      if (err) {
        return next(err);
      }
      req.login(user, function(err) {
        if (err) {
          return next(err);
        }
        if (!remember) {
          req.session.cookie.expires = false;
        }
        res.redirect('/');
      });
    });
  }
};