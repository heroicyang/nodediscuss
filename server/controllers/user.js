/**
 * 用户相关的控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash'),
  async = require('async'),
  moment = require('moment'),
  request = require('request');
var config = require('../../config'),
  md5 = require('../../utils/md5'),
  api = require('../api'),
  constants = api.constants;
var error = require('../../utils/error'),
  CentralizedError = error.CentralizedError,
  NotFoundError = error.NotFoundError;

/** 获取用户的路由中间件 */
exports.load = function(req, res, next) {
  var username = req.params.username;
  api.User.get({
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

/** 用户注册 */
exports.signup = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    req.breadcrumbs('注册');
    res.render('signup', {
      user: req.flash('body'),
      err: req.flash('err'),
      message: req.flash('message')
    });
  } else if ('post' === method) {
    api.User.add(req.body, function(err) {
      if (err) {
        return next(err);
      }
      req.flash('message', '注册成功，我们已经向你的电子邮箱发送了一封激活邮件，请前往查收并激活你的帐号。');
      res.redirect('/signup');
    });
  }
};

/** 用户登录 */
exports.signin = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    req.breadcrumbs('登录');
    res.render('signin', {
      user: req.flash('body'),
      err: req.flash('err'),
      message: req.flash('message')
    });
  } else if ('post' === method) {
    var data = req.body,
      email = data.email,
      password = data.password,
      remember = data.remember;

    api.User.check({
      email: email,
      password: password
    }, function(err, result) {
      if (err) {
        return next(err);
      }

      if (!result) {
        return next(new CentralizedError('用户不存在。' ,'email'));
      }

      if (!result.passed) {
        return next(new CentralizedError('密码不正确。', 'password'));
      }

      if (result.user.state === constants.USER_STATE.BLOCKED) {
        return next(new CentralizedError('帐号被锁定，请联系管理员解锁', 'state'));
      } else if (result.user.state !== constants.USER_STATE.ACTIVATED) {
        return next(new CentralizedError('帐号未激活', 'state'));
      }

      req.login(result.user, function(err) {
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

/** 用户登出 */
exports.logout = function(req, res) {
  req.logout();
  req.session.destroy();
  res.send({
    success: true
  });
};

/** 用户激活 */
exports.activate = function(req, res, next) {
  var data = req.query,
    token = data.token,
    email = data.email;

  async.waterfall([
    function getUser(next) {
      api.User.get({
        email: email
      }, next);
    },
    function activate(user, next) {
      if (!user || md5(user.salt + user.email) !== token) {
        return next(new CentralizedError('信息有误，帐号无法激活。', 'activated'));
      }
      if (user.state === constants.USER_STATE.ACTIVATED) {
        return next(new CentralizedError('帐号已经是激活状态。', 'activated', 'warning'));
      }
      api.User.changeState({
        id: user.id,
        state: constants.USER_STATE.ACTIVATED
      }, next);
    }
  ], function(err) {
    if (err) {
      req.flash('redirectPath', '/');
      return next(err);
    }
    req.flash('message', '帐号已激活，请登录。');
    res.redirect('/signin');
  });
};

/** 申请重置用户密码 */
exports.forgot = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    req.breadcrumbs('通过电子邮件重设密码');
    res.render('settings/forgot_pass', {
      user: req.flash('body'),
      err: req.flash('err'),
      message: req.flash('message')
    });
  } else if ('post' === method) {
    api.ResetPass.add(req.body, function(err) {
      if (err) {
        return next(err);
      }
      req.flash('message', '我们已经向你的电子邮箱发送了一封密码重置邮件，请前往查收并重设你的密码。');
      res.redirect('/forgot');
    });
  }
};

/** 重置用户密码 */
exports.resetPassword = function(req, res, next) {
  var method = req.method.toLowerCase();
  var onError = function() {
    delete req.session.resetPass;
    req.flash('redirectPath', '/');
  };

  if ('get' === method) {
    var token = req.query.token,
      email = req.query.email;
    if (!req.session.resetPass && (!token || !email)) {
      req.flash('redirectPath', '/');
      return next(new CentralizedError('信息有误，不能继续重设密码操作。'));
    }

    api.ResetPass.get({
      email: email
    }, function(err, resetPass) {
      if (err) {
        return next(err);
      }

      if (!resetPass || md5(resetPass.id + resetPass.email) !== token) {
        onError();
        return next(new CentralizedError('信息有误，不能继续重设密码操作'));
      }
      if (!resetPass.available) {
        onError();
        return next(new CentralizedError('该密码重置链接已失效', 'available', 'warning'));
      }
      if (moment().add('hours', -24).toDate() > resetPass.createdAt) {
        onError();
        return next(new CentralizedError('该密码重置链接已过期，请重新提交密码重置申请', 'expire', 'warning'));
      }

      if (!req.session.resetPass) {
        req.session.resetPass = {
          token: token,
          userId: resetPass.userId,
          id: resetPass.id
        };
      }
      req.breadcrumbs('重设密码');
      res.render('settings/reset_pass', {
        token: token,
        err: req.flash('err'),
        message: req.flash('message')
      });
    });
  } else if ('post' === method) {
    var data = req.body,
      newPassword = data.newPassword,
      newPassword2 = data.newPassword2;

    if (data.token !== req.session.resetPass.token) {
      onError();
      return next(new CentralizedError('信息有误，不能继续重设密码操作'));
    }
    if (newPassword !== newPassword2) {
      return next(new CentralizedError('两次输入的密码不一致', 'newPassword'));
    }

    async.waterfall([
      function updatePassword(next) {
        api.User.edit({
          id: req.session.resetPass.userId,
          password: newPassword
        }, next);
      },
      function updateResetPass(user, next) {
        if (!user) {
          onError();
          return next(new CentralizedError('信息有误，不能继续重设密码操作'));
        }
        api.ResetPass.setAvailable({
          id: req.session.resetPass.id,
          available: false
        }, next);
      }
    ], function(err) {
      if (err) {
        return next(err);
      }
      
      delete req.session.resetPass;
      req.flash('message', '密码重置成功，请使用新密码重新登录。');
      res.redirect('/signin');
    });
  }
};

/** 用户个人首页 */
exports.get = function(req, res, next) {
  var user = req.user;
  async.parallel({
    isFollowed: function(next) {
      if (!req.isAuthenticated() || req.currentUser.id === user.id) {
        return next(null);
      }
      api.Relation.check({
        userId: req.currentUser.id,
        targetId: user.id
      }, next);
    },
    recentTopics: function(next) {
      api.Topic.query({
        conditions: {
          'author.id': user._id
        },
        pageSize: config.pagination.pageSize
      }, function(err, count, topics) {
        next(err, topics);
      });
    },
    recentComments: function(next) {
      api.Comment.query({
        conditions: {
          'author.id': user._id,
          deleted: false
        },
        pageSize: config.pagination.pageSize
      }, function(err, count, comments) {
        if (err) {
          return next(err);
        }
        // 获取评论所对应的话题
        async.map(comments, function(comment, next) {
          api.Topic.get({
            _id: comment.refId
          }, function(err, topic) {
            if (err) {
              return next(err);
            }
            comment.topic = topic || { deleted: true };
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

/** 获取用户的 GitHub repos */
exports.repos = function(req, res, next) {
  if (!req.user.github) {
    return res.send({
      success: true,
      response: null
    });
  }

  var opts = {
    url: 'https://api.github.com/users/' + req.user.github + '/repos?type=owner',
    headers: {
      'User-Agent': req.user.github
    }
  };
  request(opts, function(err, rep, body) {
    if (err || rep.statusCode !== 200) {
      return next(err || new Error('Ops!'));
    }

    var repos = _.sortBy(JSON.parse(body), function(repo) {
      return -repo.stargazers_count;
    });
    res.send({
      success: true,
      response: {
        data: repos
      }
    });
  });
};