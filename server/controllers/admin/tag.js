/**
 * 节点管理
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

/** 节点管理列表界面 */
exports.index = function(req, res, next) {
  var pageIndex = req.query.pageIndex;
  var pagination = {
    pageIndex: pageIndex,
    pageSize: nconf.get('pagination:pageSize')
  };

  api.Tag.query({
    pageIndex: pageIndex,
    pageSize: nconf.get('pagination:pageSize')
  }, function(err, count, tags) {
    if (err) {
      return next(err);
    }
    
    pagination.totalCount = count;
    req.breadcrumbs('节点列表');
    res.render('admin/tag/index', {
      tags: tags,
      pagination: pagination
    });
  });
};

/** 创建节点界面以及数据提交 */
exports.create = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    api.Section.query({
      notPaged: true
    }, function(err, sections) {
      if (err) {
        return next(err);
      }

      req.breadcrumbs('节点列表', '/admin/tags');
      req.breadcrumbs('创建节点');
      res.render('admin/tag/edit', {
        sections: sections,
        tag: req.flash('body'),
        err: req.flash('err')
      });
    });
  } else if ('post' === method) {
    api.Tag.add(req.body, function(err) {
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
        api.Tag.get({
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
        api.Section.query({
          notPaged: true
        }, next);
      }
    }, function(err, results) {
      if (err) {
        return next(err);
      }

      req.breadcrumbs('节点列表', '/admin/tags');
      req.breadcrumbs('编辑节点');
      res.render('admin/tag/edit', {
        tag: _.extend(results.tag, req.flash('body')),
        sections: results.sections,
        err: req.flash('err')
      });
    });
  } else if ('post' === method) {
    api.Tag.edit(req.body, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/admin/tags');
    });
  }
};