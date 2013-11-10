/**
 * 暴露每次请求都需要的本地变量
 * @author heroic
 */

/**
 * Module dependencies
 */
var config = require('../config');

module.exports = exports = function(req, res, next) {
  res.locals = res.locals || {};
  res.locals.path = req.path;
  res.locals.csrfToken = req.csrfToken();

  res.locals.page = {};
  res.locals.page.title = config.title;
  next();
};