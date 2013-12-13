/**
 * 用户关联
 * @author heroic
 */

/**
 * Module dependencies
 */
var config = require('../../../config'),
  api = require('../../../api');

exports.index = function(req, res, next) {
  var pageIndex = req.query.pageIndex;
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  };

  api.user.query({
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    pagination.totalCount = results.totalCount;
    res.render('admin/user/index', {
      users: results.users,
      pagination: pagination
    });
  });
};