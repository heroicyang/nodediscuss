/**
 * 话题管理
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash'),
  config = require('../../../config'),
  api = require('../../../api'),
  NotFoundError = require('../../../utils/error').NotFoundError;

/** 话题管理列表界面 */
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
    req.breadcrumbs('话题列表');
    res.render('admin/topic/index', {
      topics: results.topics,
      pagination: pagination
    });
  });
};

exports.edit = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    async.parallel({
      topic: function(next) {
        api.topic.get({
          id: req.params.id
        }, function(err, topic) {
          if (err) {
            return next(err);
          }
          if (!topic) {
            return next(new NotFoundError('该话题不存在!'));
          }
          next(null, topic);
        });
      },
      tags: function(next) {
        api.tag.query({
          notPaged: true
        }, function(err, results) {
          if (err) {
            return next(err);
          }
          var tags = results.tags;
          next(null, _.groupBy(tags, function(tag) {
            return tag.section.name;
          }));
        });
      }
    }, function(err, results) {
      if (err) {
        return next(err);
      }
      req.breadcrumbs('话题列表', '/admin/topics');
      req.breadcrumbs('编辑话题');
      res.render('admin/topic/edit', _.extend(results, {
        topic: req.flash('body'),
        err: req.flash('err')
      }));
    });
  } else if ('post' === method) {
    api.topic.edit(req.body, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/admin/topics');
    });
  }
};