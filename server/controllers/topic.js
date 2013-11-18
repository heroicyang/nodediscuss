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

exports.index = function(req, res, next) {
  var error = _.extend(req.flash('err'), {
    showInGlobal: true
  });
  var tab = req.query.tab,
    queryOpts = {};

  switch(tab) {
    case 'excellent':
      queryOpts['conditions'] = {
        excellent: true
      };
      break;
    case 'no_comment':
      queryOpts['conditions'] = {
        commentCount: {
          $lte: 0
        }
      };
      queryOpts['sort'] =  {
        createdAt: -1
      };
      break;
    case 'latest':
      queryOpts['sort'] =  {
        createdAt: -1
      };
      break;
  }
    
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

exports.queryByTag = function(req, res, next) {
  var tagName = req.params.name;
  async.parallel({
    topics: function(next) {
      api.topic.query({
        conditions: {
          'tag.name': tagName
        }
      }, function(err, topics) {
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
      res.render('topic_editor', {
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

exports.get = function(req, res, next) {
  var id = req.params.id;
  async.parallel({
    topic: function(next) {
      // 此处调用增加阅读数量的方法，因为该方法也会返回最新的 topic 信息
      api.topic.increaseViewsCount(id, function(err, latestTopic) {
        next(err, latestTopic);
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