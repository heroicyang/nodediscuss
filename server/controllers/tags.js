/**
 * 节点相关的控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash');
var api = require('../api');
var error = require('../utils/error'),
  NotFoundError = error.NotFoundError;

/** 节点列表页面 */
exports.list = function(req, res, next) {
  async.parallel({
    sectionCount: function(next) {
      api.Section.getCount(next);
    },
    tagCount: function(next) {
      api.Tag.getCount(next);
    },
    sections: function(next) {
      api.Tag.query({
        notPaged: true
      }, function(err, tags) {
        if (err) {
          return next(err);
        }

        var sections = _.groupBy(tags, function(tag) {
          return tag.section.name;
        });
        next(null, sections);
      });
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    res.render('tag/list', results);
  });
};

/** 获取单个节点数据的路由中间件 */
exports.load = function(req, res, next) {
  api.Tag.get({
    slug: req.params.slug
  }, function(err, tag) {
    if (err) {
      return next(err);
    }
    if (!tag) {
      return next(new NotFoundError('该节点不存在。'));
    }
    req.tag = tag;
    next();
  });
};