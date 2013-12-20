/**
 * 节点组管理
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash');
var api = require('../../api'),
  config = require('../../../config'),
  NotFoundError = require('../../utils/error').NotFoundError;

/** 节点组管理首页 */
exports.index = function(req, res, next) {
  var pageIndex = req.query.pageIndex;
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  };

  api.Section.query({
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize,
    sort: {
      order: -1,
      createdAt: -1
    }
  }, function(err, count, sections) {
    if (err) {
      return next(err);
    }

    pagination.totalCount = count;
    async.map(sections, function(section, next) {
      api.Tag.getCount({
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
    res.render('admin/section/edit', {
      section: req.flash('body'),
      err: req.flash('err')
    });
  } else if ('post' === method) {
    api.Section.add(req.body, function(err) {
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
    var id = req.params.id;
    api.Section.get({
      _id: id
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
        section: _.extend(section, req.flash('body'))
      });
    });
  } else if ('post' === method) {
    api.Section.edit(req.body, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/admin/sections');
    });
  }
};