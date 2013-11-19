/**
 * 用户相关的视图控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash'),
  async = require('async'),
  api = require('../../api'),
  config = require('../../config');

exports.signup = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    var locals = _.extend({}, req.flash('body'), {
      err: req.flash('err')
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
      err: req.flash('err'),
      message: req.flash('message')
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

exports.activate = function(req, res, next) {
  var data = req.query,
    token = data.token,
    email = data.email;

  api.user.activate(token, email, function(err) {
    if (err) {
      req.session.redirectPath = '/';
      return next(err);
    }
    req.flash('message', '帐号已激活，请登录');
    res.redirect('/signin');
  });
};

exports.index = function(req, res, next) {
  var username = req.params.username;
  async.parallel({
    user: function(next) {
      api.user.findByUsername(username, function(err, user) {
        next(err, user);
      });
    },
    latestTopics: function(next) {
      api.topic.query({
        conditions: { 'author.username': username },
        sort: { createdAt: -1 }
      }, function(err, topics) {
        next(err, topics);
      });
    },
    latestComments: function(next) {
      api.comment.query({
        conditions: { 'author.username': username },
        sort: { createdAt: -1 }
      }, function(err, comments) {
        if (err) {
          return next(err);
        }
        async.map(comments, function(comment, next) {
          api.topic.getById(comment.topicId, function(err, topic) {
            if (err) {
              return next(err);
            }
            _.extend(comment, {
              topic: topic
            });
            next(null, comment);
          });
        }, function(err, comments) {
          next(err, comments);
        });
      });
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    res.render('user', results);
  });
};