/**
 * 话题管理
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

  api.topic.query({
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    pagination.totalCount = results.totalCount;
    res.render('admin/topic/index', {
      topics: results.topics,
      pagination: pagination
    });
  });
};