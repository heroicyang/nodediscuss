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
exports.list = function(req, res, next) {
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
      api.tag.query({
        notPaged: true
      },function(err, tags) {
        if (err) {
          return next(err);
        }
        tags = groupingTagsBySection(tags);
        next(null, tags);
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
    tag: function(next) {
      api.tag.get({
        name: tagName
      }, function(err, tag) {
        if (err) {
          return next(err);
        }
        if (!tag) {
          err = new Error('话题不存在！');
          err.code = 404;
          return next(err);
        }
        return next(null, tag);
      });
    },
    isTagFavorited: function(next) {
      if (!req.isAuthenticated()) {
        return next(null, false);
      }
      
      api.tag.isFavoritedBy({
        name: tagName,
        userId: req.user.id
      }, function(err, favorited) {
        next(err, favorited);
      });
    },
    topics: function(next) {
      api.topic.query(queryOpts, function(err, topics) {
        next(err, topics);
      });
    },
    tags: function(next) {
      api.tag.query({
        notPaged: true
      },function(err, tags) {
        if (err) {
          return next(err);
        }
        tags = groupingTagsBySection(tags);
        next(null, tags);
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
    async.parallel({
      tags: function(next) {
        api.tag.query({
          notPaged: true
        },function(err, tags) {
          if (err) {
            return next(err);
          }
          tags = groupingTagsBySection(tags);
          next(null, tags);
        });
      },
      currentTag: function(next) {
        var tagName = req.query.tag;
        if (!tagName) {
          return next(null, null);
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

/** 话题编辑页面 */
exports.edit = function(req, res, next) {
  var method = req.method.toLowerCase(),
    topicId = req.params.id;

  if ('get' === method) {
    async.parallel({
      tags: function(next) {
        api.tag.query({
          notPaged: true
        },function(err, tags) {
          if (err) {
            return next(err);
          }
          tags = groupingTagsBySection(tags);
          next(null, tags);
        });
      }
    }, function(err, results) {
      if (err) {
        return next(err);
      }
      req.breadcrumbs('话题详情', '/topic/' + req.topic._id);
      req.breadcrumbs('编辑话题');
      res.render('topic_edit', {
        tags: results.tags,
        topic: req.topic,
        err: req.flash('err')
      });
    });
    return;
  }

  if ('post' === method) {
    var data = req.body;
    if (data.id !== topicId) {
      return next('Ops! 貌似某些地方出错啦!');
    }
    api.topic.edit(data, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/topic/' + topicId);
    });
  }
};

/**
 * 话题详细页面
 */
exports.get = function(req, res, next) {
  var id = req.params.id;
  var error = _.extend(req.flash('err'), {
    showInGlobal: true
  });
  async.parallel({
    topic: function(next) {
      api.topic.get({
        id: id,
        isView: true
      }, function(err, topic) {
        next(err, topic);
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
        id: id,
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
    res.render('topic', _.extend(results, {
      err: error
    }));
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

function groupingTagsBySection(tags) {
  return _.groupBy(tags, function(tag) {
    return tag.section.name;
  });
}