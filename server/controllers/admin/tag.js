/**
 * 节点管理
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash'),
  api = require('../../../api'),
  config = require('../../../config');

/** 节点管理列表界面 */
exports.index = function(req, res, next) {
  var pageIndex = req.query.pageIndex;
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  };

  api.tag.query({
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    
    pagination.totalCount = results.totalCount;
    req.breadcrumbs('节点列表');
    res.render('admin/tag/index', {
      tags: results.tags,
      pagination: pagination
    });
  });
};

exports.create = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    api.section.query({
      notPaged: true
    }, function(err, results) {
      if (err) {
        return next(err);
      }

      req.breadcrumbs('节点列表', '/admin/tags');
      req.breadcrumbs('创建节点');
      res.render('admin/tag/edit', _.extend({
        sections: results.sections,
        err: req.flash('err')
      }, req.flash('body')));
    });
  } else if ('post' === method) {
    api.tag.create(req.body, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/admin/tags');
    });
  }
};