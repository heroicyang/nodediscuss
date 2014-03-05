/**
 * 用户管理
 * @author heroic
 */

/**
 * Module dependencies
 */
var nconf = require('nconf');
var api = require('../../api');

exports.index = function(req, res, next) {
  var pageIndex = req.query.pageIndex;
  var pagination = {
    pageIndex: pageIndex,
    pageSize: nconf.get('pagination:pageSize')
  };

  api.User.query({
    pageIndex: pageIndex,
    pageSize: nconf.get('pagination:pageSize')
  }, function(err, count, users) {
    if (err) {
      return next(err);
    }

    pagination.totalCount = count;
    res.render('admin/user/index', {
      users: users,
      pagination: pagination
    });
  });
};
