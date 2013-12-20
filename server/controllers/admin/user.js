/**
 * 用户管理
 * @author heroic
 */

/**
 * Module dependencies
 */
var config = require('../../../config'),
  api = require('../../api');

exports.index = function(req, res, next) {
  var pageIndex = req.query.pageIndex;
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  };

  api.User.query({
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  }, function(err, count, users) {
    if (err) {
      return next(err);
    }

    req.breadcrumbs('用户列表');
    pagination.totalCount = count;
    res.render('admin/user/index', {
      users: users,
      pagination: pagination
    });
  });
};