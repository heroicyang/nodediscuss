/**
 * 节点组管理
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

/** 节点组管理首页 */
exports.index = function(req, res, next) {
  var pageIndex = req.query.pageIndex;
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  };

  api.section.query({
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize,
    sort: {
      order: -1,
      createdAt: -1
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    pagination.totalCount = results.totalCount;
    async.map(results.sections, function(section, next) {
      api.tag.count({
        'section.id': section._id
      }, function(err, count) {
        if (err) {
          return next(err);
        }
        section.tagCount = count;
        next(null, section);
      });
    }, function(err, sections) {
      if (err) {
        return next(err);
      }
      req.breadcrumbs('节点组列表');
      res.render('admin/section/index', {
        sections: sections,
        pagination: pagination
      });
    });
  });
};

/** 创建节点组 */
exports.create = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    req.breadcrumbs('节点组列表', '/admin/sections');
    req.breadcrumbs('创建节点组');
    res.render('admin/section/edit', _.extend({
      err: req.flash('err')
    }, req.flash('body')));
  } else if ('post' === method) {
    api.section.create(req.body, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/admin/sections');
    });
  }
};

/** 编辑节点组 */
exports.edit = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    var name = req.params.name;
    api.section.get({
      name: name
    }, function(err, section) {
      if (err) {
        return next(err);
      }
      if (!section) {
        return next(new NotFoundError('该节点组不存在!'));
      }

      req.breadcrumbs('节点组列表', '/admin/sections');
      req.breadcrumbs('编辑节点组');
      res.render('admin/section/edit', {
        err: req.flash('err'),
        section: section
      });
    });
  } else if ('post' === method) {
    api.section.edit(req.body, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/admin/sections');
    });
  }
};