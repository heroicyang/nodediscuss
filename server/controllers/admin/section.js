/**
 * 节点组管理
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  api = require('../../../api');

/** 节点组管理首页 */
exports.index = function(req, res, next) {
  api.section.query({
    notPaged: true,
    sort: {
      order: -1,
      createdAt: -1
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
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
        sections: sections
      });
    });
  });
};

/** 创建节点组 */
exports.create = function(req, res, next) {
  api.section.create(req.body, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/admin/sections');
  });
};