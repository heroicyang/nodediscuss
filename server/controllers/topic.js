/**
 * 话题相关的视图控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash'),
  api = require('../../api');

/**
 * 话题列表页面
 */
exports.index = function(req, res, next) {
  var error = _.extend(req.flash('err'), {
    showInGlobal: true
  });
  var tab = req.query.tab,
    queryOpts = getTabQueryOptions(tab);
    
  async.parallel({
    topics: function(next) {
      api.topic.query(queryOpts, function(err, topics) {
        next(err, topics);
      });
    },
    tags: function(next) {
      api.tag.getGroupedTags(function(err, tags) {
        next(err, tags);
      });
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    req.breadcrumbs('社区');
    res.render('topics', _.extend({
      err: error
    }, results));
  });
};

/**
 * 节点下的话题列表页面
 */
exports.queryByTag = function(req, res, next) {
  var tab = req.query.tab,
    tagName = req.params.name,
    queryOpts = getTabQueryOptions(tab);

  queryOpts.conditions = queryOpts.conditions || {};
  queryOpts.conditions['tag.name'] = tagName;

  async.parallel({
    topics: function(next) {
      api.topic.query(queryOpts, function(err, topics) {
        next(err, topics);
      });
    },
    tags: function(next) {
      api.tag.getGroupedTags(function(err, tags) {
        next(err, tags);
      });
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    req.breadcrumbs(tagName);
    res.render('topics', results);
  });
};

/**
 * 发布新话题
 */
exports.create = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    async.waterfall([
      function getTags(next) {
        api.tag.getGroupedTags(function(err, tags) {
          next(err, tags);
        });
      }
    ], function(err, tags) {
      if (err) {
        return next(err);
      }
      req.breadcrumbs('发表新话题');
      res.render('topic_edit', {
        tags: tags,
        err: req.flash('err')
      });
    });
    return ;
  }

  if ('post' === method) {
    var data = req.body;
    _.extend(data, {
      author: {
        id: req.user.id
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

/**
 * 话题详细页面
 */
exports.get = function(req, res, next) {
  var id = req.params.id;
  async.parallel({
    topic: function(next) {
      // 此处调用增加阅读数量的方法，因为该方法也会返回最新的 topic 信息
      api.topic.increaseViewsCount({
        id: id
      }, function(err, latestTopic) {
        next(err, latestTopic);
      });
    },
    comments: function(next) {
      api.comment.query({
        conditions: { topicId: id }
      }, function(err, comments) {
        next(err, comments);
      });
    },
    isFavorited: function(next) {
      if (!req.isAuthenticated()) {
        return next(null, false);
      }
      api.topic.isFavoritedBy({
        topicId: id,
        userId: req.user.id
      }, function(err, favorited) {
        return next(err, favorited);
      });
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    req.breadcrumbs(results.topic.tag.name, '/tag/' + results.topic.tag.name);
    req.breadcrumbs('话题详情');
    res.render('topic', results);
  });
};

function getTabQueryOptions(tab) {
  var queryOpts = {};

  if (tab === 'excellent') {
    queryOpts.conditions = {
      excellent: true
    };
  } else if (tab === 'no_comment') {
    queryOpts.conditions = {
      commentCount: {
        $lte: 0
      }
    };
    queryOpts.sort =  {
      createdAt: -1
    };
  } else if (tab === 'latest') {
    queryOpts.sort =  {
      createdAt: -1
    };
  }

  return queryOpts;
}