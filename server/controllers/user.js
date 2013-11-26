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
      err: req.flash('err'),
      message: req.flash('message')
    });
    req.breadcrumbs('注册');
    return res.render('signup', locals);
  }

  if ('post' === method) {
    api.user.create(req.body, function(err) {
      if (err) {
        return next(err);
      }
      req.flash('message', '注册成功，我们已经向你的电子邮箱发送了一封激活邮件，请前往查收并激活你的帐号。');
      res.redirect('signup');
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

    api.user.check({
      email: email,
      password: password
    }, function(err, user) {
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

exports.logout = function(req, res, next) {
  req.logout();
  req.session.destroy();
  res.send({
    success: true
  });
};

exports.activate = function(req, res, next) {
  var data = req.query,
    token = data.token,
    email = data.email;

  api.user.activate({
    token: token,
    email: email
  }, function(err) {
    if (err) {
      req.session.redirectPath = '/';
      return next(err);
    }
    req.flash('message', '帐号已激活，请登录。');
    res.redirect('/signin');
  });
};

exports.get = function(req, res, next) {
  var username = req.params.username;
  async.parallel({
    user: function(next) {
      api.user.get({
        username: username
      }, function(err, user) {
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
        conditions: {
          'author.username': username,
          deleted: false
        },
        sort: { createdAt: -1 }
      }, function(err, comments) {
        if (err) {
          return next(err);
        }
        async.map(comments, function(comment, next) {
          api.topic.get({
            id: comment.topicId
          }, function(err, topic) {
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

exports.settings = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    api.user.get({
      id: req.user.id
    }, function(err, user) {
      if (err) {
        return next(err);
      }
      req.breadcrumbs('设置');
      res.render('settings', {
        loggedUser: user
      });
    });
    return ;
  }
};