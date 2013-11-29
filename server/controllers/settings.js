/**
 * 用户设置相关的控制逻辑
 * @author heroic
 */

/** 用户设置页面 */
exports.profile = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    req.breadcrumbs('设置');
    return res.render('settings');
  }

  if ('post' === method) {
    // 更新用户基本资料
  }
};

/** 更改用户密码 */
exports.changePassword = function(req, res, next) {

};