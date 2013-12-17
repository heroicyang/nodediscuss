/**
 * 页面管理
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

/** 页面列表界面 */
exports.index = function(req, res, next) {
  var pageIndex = req.query.pageIndex;
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  };

  api.page.query({
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    pagination.totalCount = results.totalCount;
    async.map(results.pages, function(page, next) {
      api.user.query({
        _id: {
          $in: page.authorIds
        }
      }, function(err, results) {
        if (err) {
          return next(err);
        }
        page.authors = results.users;
        next(null, page);
      });
    }, function(err, pages) {
      if (err) {
        return next(err);
      }

      req.breadcrumbs('页面列表');
      res.render('admin/page/index', {
        pages: pages,
        pagination: pagination
      });
    });
  });
};

/** 创建新页面界面以及数据保存 */
exports.create = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    req.breadcrumbs('页面列表', '/admin/pages');
    req.breadcrumbs('创建页面');
    res.render('admin/page/edit', _.extend({
      page: req.flash('body'),
      err: req.flash('err')
    }));
  } else if ('post' === method) {
    var data = req.body;
    data.authorId = req.currentUser.id;
    api.page.create(data, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/admin/pages');
    });
  }
};

/** 页面编辑界面及数据保存 */
exports.edit = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    api.page.get({
      _id: req.params.id
    }, function(err, page) {
      if (err) {
        return next(err);
      }
      if (!page) {
        return next(new NotFoundError('该页面不存在!'));
      }

      req.breadcrumbs('页面列表', '/admin/pages');
      req.breadcrumbs('编辑页面');
      res.render('admin/page/edit', {
        page: _.extend(page, req.flash('body')),
        err: req.flash('err')
      });
    });
  } else if ('post' === method) {
    var data = req.body;
    data.editorId = req.currentUser.id;
    api.page.edit(data, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/admin/pages');
    });
  }
};