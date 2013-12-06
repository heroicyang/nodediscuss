/**
 * 用户相关的控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash'),
  async = require('async'),
  api = require('../../api'),
  NotFoundError = require('../../utils/error').NotFoundError;

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

exports.forgotPassword = function(req, res, next) {

};

exports.load = function(req, res, next) {
  var username = req.params.username;
  api.user.get.call(req, {
    username: username
  }, function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new NotFoundError('该用户不存在。'));
    }
    req.user = user;
    next();
  });
};

exports.get = function(req, res, next) {
  var user = req.user;
  async.parallel({
    latestTopics: function(next) {
      api.topic.query({
        query: {
          'author.username': user.username
        }
      }, function(err, results) {
        if (err) {
          return next(err);
        }
        next(null, _.extend(results.topics, {
          totalCount: results.totalCount
        }));
      });
    },
    latestComments: function(next) {
      api.comment.query({
        query: {
          'author.username': user.username,
          deleted: false
        }
      }, function(err, results) {
        if (err) {
          return next(err);
        }

        var comments = _.extend(results.comments, {
          totalCount: results.totalCount
        });
        async.map(comments, function(comment, next) {
          api.topic.get({
            id: comment.fkId
          }, function(err, topic) {
            if (err) {
              return next(err);
            }
            _.extend(comment, {
              topic: topic || {
                deleted: true
              }
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
    res.render('user', _.extend(results, {
      user: user
    }));
  });
};