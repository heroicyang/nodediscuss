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
  config = require('../../../config'),
  NotFoundError = require('../../../utils/error').NotFoundError;

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

/** 创建节点界面以及数据提交 */
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

exports.edit = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    async.parallel({
      tag: function(next) {
        var slug = req.params.slug;
        api.tag.get({
          slug: slug
        }, function(err, tag) {
          if (err) {
            return next(err);
          }
          if (!tag) {
            return next(new NotFoundError('该节点不存在!'));
          }
          next(null, tag);
        });
      },
      sections: function(next) {
        api.section.query({
          notPaged: true
        }, function(err, results) {
          if (err) {
            return next(err);
          }
          next(null, results.sections);
        });
      }
    }, function(err, results) {
      if (err) {
        return next(err);
      }

      req.breadcrumbs('节点列表', '/admin/tags');
      req.breadcrumbs('编辑节点');
      res.render('admin/tag/edit', _.extend(results, {
        err: req.flash('err')
      }, req.flash('body')));
    });
  } else if ('post' === method) {
    api.tag.edit(req.body, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/admin/tags');
    });
  }
};