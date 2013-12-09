/**
 * 话题相关的视图控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash'),
  config = require('../../config'),
  api = require('../../api'),
  NotFoundError = require('../../utils/error').NotFoundError;

/** 发布新话题 */
exports.create = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    async.parallel({
      tags: function(next) {
        api.tag.query({
          pageSize: Infinity
        }, function(err, results) {
          if (err) {
            return next(err);
          }
          var tags = results.tags;
          next(null, _.groupBy(tags, function(tag) {
            return tag.section.name;
          }));
        });
      },
      currentTag: function(next) {
        var tagName = req.query.tag;
        if (!tagName) {
          return next(null);
        }
        api.tag.get({
          name: tagName
        }, function(err, tag) {
          next(err, tag);
        });
      }
    }, function(err, results) {
      if (err) {
        return next(err);
      }
      req.breadcrumbs('发布新话题');
      res.render('topic_edit', _.extend(results, {
        err: req.flash('err')
      }));
    });
    return;
  }

  if ('post' === method) {
    var data = req.body;
    _.extend(data, {
      author: {
        id: req.currentUser.id
      }
    });

    api.topic.create(data, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  }
};

/** 编辑话题 */
exports.edit = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    async.parallel({
      tags: function(next) {
        api.tag.query({
          pageSize: Infinity
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
      req.breadcrumbs('话题详情', '/topic/' + req.topic._id);
      req.breadcrumbs('编辑话题');
      res.render('topic_edit', _.extend(results, {
        topic: req.topic,
        err: req.flash('err')
      }));
    });
    return;
  }

  if ('post' === method) {
    var data = req.body;
    api.topic.edit(data, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/topic/' + req.topic.id);
    });
  }
};

/** 根据话题 id 获取话题 */
exports.load = function(req, res, next) {
  var id = req.params.id;
  api.topic.get.call(req, {
    id: id
  }, function(err, topic) {
    if (err) {
      return next(err);
    }
    if (!topic) {
      return next(new NotFoundError('该话题不存在。'));
    }
    req.topic = topic;
    next();
  });
};

/** 话题详细页面 */
exports.get = function(req, res, next) {
  var pageIndex = parseInt(req.query.pageIndex || 1, 10);
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  };

  var error = _.extend(req.flash('err'), {
    global: true
  });

  async.parallel({
    incViewsCount: function(next) {
      req.topic.incViewsCount(function(err, topic) {
        if (err) {
          return next(err);
        }
        next(null, topic.viewsCount);
      });
    },
    comments: function(next) {
      api.comment.query({
        query: {
          fkId: req.topic.id
        },
        pageIndex: pageIndex,
        pageSize: config.pagination.pageSize
      }, function(err, results) {
        if (err) {
          return next(err);
        }

        pagination.totalCount = results.totalCount;
        next(null, results.comments);
      });
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    
    req.breadcrumbs(req.topic.tag.name, '/tag/' + req.topic.tag.name);
    req.breadcrumbs('话题详情');
    res.render('topic', _.extend(results, {
      topic: req.topic,
      pagination: pagination,
      err: error
    }));
  });
};

/** 删除话题 */
exports.remove = function(req, res, next) {

};