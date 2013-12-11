/**
 * 用户相关的控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash'),
  async = require('async'),
  config = require('../../config'),
  api = require('../../api'),
  CentralizedError = require('../../utils/error').CentralizedError,
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
      res.redirect('/signup');
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
      req.flash('redirectPath', '/');
      return next(err);
    }
    req.flash('message', '帐号已激活，请登录。');
    res.redirect('/signin');
  });
};

exports.forgotPassword = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    var locals = _.extend({}, req.flash('body'), {
      err: req.flash('err'),
      message: req.flash('message')
    });
    req.breadcrumbs('通过电子邮件重设密码');
    return res.render('settings/forgot_pass', locals);
  }

  if ('post' === method) {
    api.user.forgotPassword(req.body, function(err) {
      if (err) {
        return next(err);
      }
      req.flash('message', '我们已经向你的电子邮箱发送了一封密码重置邮件，请前往查收并重设你的密码。');
      res.redirect('/forgot');
    });
  }
};

exports.resetPassword = function(req, res, next) {
  var method = req.method.toLowerCase();

  var token = req.query.token || req.session.token,
    email = req.query.email || req.session.email;

  if ('get' === method) {
    var locals = _.extend({}, req.flash('body'), {
      err: req.flash('err'),
      message: req.flash('message')
    });

    if (!token || !email) {
      req.flash('redirectPath', '/');
      return next(new CentralizedError('信息有误，不能继续重设密码操作。'));
    }

    api.user.getResetPassRecord({
      email: email,
      token: token
    }, function(err, resetPass) {
      if (err) {
        req.flash('redirectPath', '/');
        return next(err);
      }

      req.session.token = req.session.token || token;
      req.session.email = req.session.email || email;
      req.breadcrumbs('重设密码');
      return res.render('settings/reset_pass', _.extend(locals, {
        userId: resetPass.userId,
        resetPassId: resetPass.id,
        token: token
      }));
    });
    return;
  }

  if ('post' === method) {
    var newPassword = req.body.newPassword,
      newPassword2 = req.body.newPassword2,
      userId = req.body.userId,
      resetPassId = req.body.resetPassId;

    if (req.body.token !== token || !userId || !resetPassId) {
      return next(new CentralizedError('信息有误，不能继续重设密码操作'));
    }

    if (newPassword !== newPassword2) {
      return next(new CentralizedError('两次输入的密码不一致', 'newPassword'));
    }

    api.user.resetPassword({
      userId: userId,
      newPassword: newPassword,
      resetPassId: resetPassId
    }, function(err) {
      if (err) {
        return next(err);
      }

      delete req.session.token;
      delete req.session.email;
      req.flash('message', '密码重置成功，请使用新密码重新登录。');
      res.redirect('/signin');
    });
  }
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
        },
        pageSize: config.pagination.pageSize
      }, function(err, results) {
        if (err) {
          return next(err);
        }
        next(null, results.topics);
      });
    },
    latestComments: function(next) {
      api.comment.query({
        query: {
          'author.username': user.username,
          deleted: false
        },
        pageSize: config.pagination.pageSize
      }, function(err, results) {
        if (err) {
          return next(err);
        }

        async.map(results.comments, function(comment, next) {
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
    res.render('user/homepage', _.extend(results, {
      user: user
    }));
  });
};

exports.comments = function(req, res, next) {
  var pageIndex = parseInt(req.query.pageIndex || 1, 10);
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  };

  api.comment.query({
    query: {
      'author.username': req.user.username,
      deleted: false
    },
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    pagination.totalCount = results.totalCount;

    async.map(results.comments, function(comment, next) {
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
      if (err) {
        return next(err);
      }

      req.breadcrumbs(req.user.nickname, '/user/' + req.user.username);
      req.breadcrumbs('全部评论');
      res.render('user/comments', {
        comments: comments,
        pagination: pagination
      });
    });
  });
};