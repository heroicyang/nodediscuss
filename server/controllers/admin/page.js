/**
 * 页面管理
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash'),
  nconf = require('nconf');
var api = require('../../api'),
  NotFoundError = require('../../utils/error').NotFoundError;

/** 页面列表界面 */
exports.index = function(req, res, next) {
  var pageIndex = req.query.pageIndex;
  var pagination = {
    pageIndex: pageIndex,
    pageSize: nconf.get('pagination:pageSize')
  };

  api.Page.query({
    pageIndex: pageIndex,
    pageSize: nconf.get('pagination:pageSize')
  }, function(err, count, pages) {
    if (err) {
      return next(err);
    }

    pagination.totalCount = count;
    async.map(pages, function(page, next) {
      api.User.query({
        _id: {
          $in: page.contributors
        }
      }, function(err, count, users) {
        if (err) {
          return next(err);
        }
        page.contributors = users;
        next(null, page);
      });
    }, function(err, pages) {
      if (err) {
        return next(err);
      }

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
    res.render('admin/page/edit', _.extend({
      page: req.flash('body'),
      err: req.flash('err')
    }));
  } else if ('post' === method) {
    var data = req.body;
    data.creatorId = req.currentUser.id;
    api.Page.add(data, function(err) {
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
    api.Page.get({
      _id: req.params.id
    }, function(err, page) {
      if (err) {
        return next(err);
      }
      if (!page) {
        return next(new NotFoundError('该页面不存在!'));
      }

      res.render('admin/page/edit', {
        page: _.extend(page, req.flash('body')),
        err: req.flash('err')
      });
    });
  } else if ('post' === method) {
    var data = req.body;
    data.editorId = req.currentUser.id;
    api.Page.edit(data, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/admin/pages');
    });
  }
};
