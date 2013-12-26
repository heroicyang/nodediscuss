/**
 * 适用于 Express 的通用面包屑导航中间件
 * @author heroic
 * /

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * 初始化面包屑导航
 * 每次请求时会为 `req` 对象附加 `breadcrumbs` 方法
 */
exports.init = function() {
  var breadcrumbs = [];

  function exists(breadcrumb) {
    return _.findIndex(breadcrumbs, breadcrumb) !== -1;
  }

  function addBreadcrumbs(name, url) {
    if (arguments.length === 1) {
      if (_.isArray(name)) {
        _.each(name, function(breadcrumb) {
          if (!exists(breadcrumb)) {
            breadcrumbs.push(breadcrumb);
          }
        });
      } else if (_.isObject(name)) {
        if (!exists(name)) {
          breadcrumbs.push(name);
        }
      } else {
        if (!exists(name)) {
          breadcrumbs.push({ name: name });
        }
      }
    } else if (arguments.length === 2) {
      if (!exists(name)) {
        breadcrumbs.push({
          name: name,
          url: url
        });
      }
    } else {
      return breadcrumbs;
    }
  }

  function cleanBreadcrumbs() {
    breadcrumbs = [];
  }

  return function(req, res, next) {
    cleanBreadcrumbs();
    req.breadcrumbs = addBreadcrumbs;
    next();
  };
};

/**
 * 设置面包屑导航的主页信息
 * @param {Object} options
 *  - name    主页名称
 *  - url     主页地址
 */
exports.setHome = function(options) {
  options = options || {};
  var homeName = options.name || 'Home',
    homeUrl = options.url || '/';

  return function(req, res, next) {
    var homeBreadcrumb = _.find(req.breadcrumbs(), function(breadcrumb) {
      return breadcrumb._home;
    });

    if (!homeBreadcrumb) {
      req.breadcrumbs({
        name: homeName,
        url: homeUrl,
        _home: true
      });
    } else {
      _.extend(homeBreadcrumb, {
        name: homeName,
        url: homeUrl
      });
    }

    next();
  };
};