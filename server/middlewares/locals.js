/**
 * 设置每次请求都会用到的本地变量
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash'),
  moment = require('moment'),
  config = require('../../config');

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
    res.locals.loggedUser = req.user;

    res.locals.path = req.path;
    res.locals.query = req.query;
    
    res.locals._ = _;
    res.locals.moment = moment;
    next();
  };
};