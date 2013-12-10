/**
 * 用户设置相关的控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var api = require('../../api'),
  CentralizedError = require('../../utils/error').CentralizedError;

/** 用户设置页面 */
exports.get = function(req, res)  {
  var settingType = req.session.settingType;
  if (settingType) {
    delete req.session.settingType;
  }

  req.breadcrumbs('设置');
  return res.render('settings/index', {
    type: settingType,
    err: req.flash('err'),
    message: req.flash('message')
  });
};

/** 更新用户基本资料 */
exports.profile = function(req, res, next) {
  var userData = req.body;
  userData.id = req.currentUser.id;

  api.user.edit(userData, function(err) {
    req.session.settingType = 'profile';
    if (err) {
      return next(err);
    }

    req.flash('message', '个人资料更新成功');
    res.redirect('/settings');
  });
};

/** 更改用户密码 */
exports.changePassword = function(req, res, next) {
  var oldPassword = req.body.oldPassword,
    newPassword = req.body.newPassword,
    newPassword2 = req.body.newPassword2;

  if (!oldPassword && !newPassword && !newPassword2) {
    return res.redirect('/settings');
  }

  req.session.settingType = 'changePass';
  if (newPassword !== newPassword2) {
    req.session.redirectPath = '/settings#change-password';
    return next(new CentralizedError('两次输入的密码不一致', 'newPassword'));
  }

  api.user.changePassword.call(req, {
    oldPassword: oldPassword,
    newPassword: newPassword
  }, function(err) {
    if (err) {
      req.session.redirectPath = '/settings#change-password';
      return next(err);
    }

    req.flash('message', '密码更改成功');
    res.redirect('/settings#change-password');
  });
};