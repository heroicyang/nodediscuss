/**
 * 设置每次请求都会用到的本地变量
 * @author heroic
 */

/**
 * Module dependencies
 */
var config = require('../../config');

module.exports = exports = function() {
  return function(req, res, next) {
    res.locals = res.locals || {};
    res.locals.path = req.path;
    res.locals.csrfToken = req.csrfToken();

    // 设置 breadcrumbs 数据
    res.locals.breadcrumbs = req.breadcrumbs();

    res.locals.page = {};
    res.locals.page.title = config.title;

    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.user = req.user;
    next();
  };
};