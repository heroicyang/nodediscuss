/**
 * 话题相关的控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash'),
  nconf = require('nconf');
var api = require('../api');
var error = require('../utils/error'),
  NotFoundError = error.NotFoundError;

/** 社区页面话题列表 */
exports.home = function(req, res, next) {
  var filter = req.query.filter,
    pageIndex = parseInt(req.query.pageIndex, 10);

  var error = _.extend(req.flash('err'), {
    global: true
  });
  var pagination = {
    pageIndex: pageIndex,
    pageSize: nconf.get('pagination:pageSize')
  };

  var conditions = {},
    sort;
  switch(filter) {
  case 'excellent':
    conditions.excellent = true;
    break;
  case 'no-comment':
    conditions.commentCount = {
      $lte: 0
    };
    break;
  case 'latest':
    break;
  default:
    sort = {
      createdAt: -1,
      lastCommentedAt: -1
    };
  }

  async.parallel({
    topics: function(next) {
      api.Topic.query({
        conditions: conditions,
        sort: sort,
        pageIndex: pageIndex,
        pageSize: nconf.get('pagination:pageSize')
      }, function(err, count, topics) {
        if (err) {
          return next(err);
        }
        pagination.totalCount = count;
        next(err, topics);
      });
    },
    tags: function(next) {
      api.Tag.query({
        notPaged: true
      }, function(err, tags) {
        if (err) {
          return next(err);
        }
        next(null, _.groupBy(tags, function(tag) {
          return tag.section.name;
        }));
      });
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    res.render('topic/list', _.extend(results, {
      pagination: pagination,
      url: '/topics',
      filterType: filter,
      err: error
    }));
  });
};

/** 某个节点下面的话题列表 */
exports.belongsTag = function(req, res, next) {
  var slug = req.params.slug,
    filter = req.query.filter,
    pageIndex = parseInt(req.query.pageIndex, 10);

  var pagination = {
    pageIndex: pageIndex,
    pageSize: nconf.get('pagination:pageSize')
  };

  var sort,
    conditions = {
      'tag.slug': slug
    };
  switch(filter) {
  case 'excellent':
    conditions.excellent = true;
    break;
  case 'no-comment':
    conditions.commentCount = {
      $lte: 0
    };
    break;
  case 'latest':
    break;
  default:
    sort = {
      createdAt: -1,
      lastCommentedAt: -1
    };
  }

  async.parallel({
    isFavoritedTag: function(next) {
      if (!req.isAuthenticated()) {
        return next(null, false);
      }
      api.Tag.getFavoritedState({
        tagId: req.tag.id,
        userId: req.currentUser.id
      }, next);
    },
    topics: function(next) {
      api.Topic.query({
        conditions: conditions,
        sort: sort,
        pageIndex: pageIndex,
        pageSize: nconf.get('pagination:pageSize')
      }, function(err, count, topics) {
        if (err) {
          return next(err);
        }
        pagination.totalCount = count;
        next(null, topics);
      });
    },
    tags: function(next) {
      api.Tag.query({
        notPaged: true
      }, function(err, tags) {
        if (err) {
          return next(err);
        }
        next(null, _.groupBy(tags, function(tag) {
          return tag.section.name;
        }));
      });
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    res.render('topic/list', _.extend(results, {
      pagination: pagination,
      tag: req.tag,
      url: '/tags/' + req.tag.slug + '/topics',
      filterType: filter
    }));
  });
};

/** 用户发布的话题列表 */
exports.createdByUser = function(req, res, next) {
  var pageIndex = parseInt(req.query.pageIndex, 10);
  var pagination = {
    pageIndex: pageIndex,
    pageSize: nconf.get('pagination:pageSize')
  };

  api.Topic.query({
    conditions: {
      'author.id': req.user.id
    },
    pageIndex: pageIndex,
    pageSize: nconf.get('pagination:pageSize')
  }, function(err, count, topics) {
    if (err) {
      return next(err);
    }

    pagination.totalCount = count;
    res.render('user/topics', _.extend({
      hiddenAvatar: true,
      topics: topics,
      pagination: pagination
    }));
  });
};

/** 关注的用户所发布的话题列表 */
exports.createdByFriends = function(req, res, next) {
  var pageIndex = parseInt(req.query.pageIndex, 10);
  var pagination = {
    pageIndex: pageIndex,
    pageSize: nconf.get('pagination:pageSize')
  };

  async.waterfall([
    function queryFriendIds(next) {
      api.Relation.query({
        conditions: {
          userId: req.currentUser.id
        },
        notPaged: true
      }, function(err, count, friendIds) {
        next(err, friendIds);
      });
    },
    function queryTopics(friendIds, next) {
      api.Topic.query({
        conditions: {
          'author.id': {
            $in: friendIds
          }
        },
        pageIndex: pageIndex,
        pageSize: nconf.get('pagination:pageSize')
      }, function(err, count, topics) {
        if (err) {
          return next(err);
        }
        pagination.totalCount = count;
        next(null, topics);
      });
    }
  ], function(err, topics) {
    if (err) {
      return next(err);
    }

    res.render('user/topics', {
      topics: topics,
      pagination: pagination
    });
  });
};

/** 获取单个话题数据的路由中间件 */
exports.load = function(req, res, next) {
  var id = req.params.id;
  api.Topic.get({
    _id: id
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

/** 发布新话题 */
exports.create = function(req, res, next) {
  var method = req.method.toLowerCase();

  if ('get' === method) {
    async.parallel({
      tags: function(next) {
        api.Tag.query({
          notPaged: true
        }, function(err, tags) {
          if (err) {
            return next(err);
          }
          next(null, _.groupBy(tags, function(tag) {
            return tag.section.name;
          }));
        });
      },
      currentTag: function(next) {
        if (!req.query.tag) {
          return next(null);
        }
        api.Tag.get({
          slug: req.query.tag
        }, next);
      }
    }, function(err, results) {
      if (err) {
        return next(err);
      }

      res.render('topic/edit', _.extend(results, {
        topic: req.flash('body'),
        err: req.flash('err')
      }));
    });
  } else if ('post' === method) {
    var topicData = req.body;
    topicData.author = {
      id: req.currentUser.id
    };
    api.Topic.add(topicData, function(err) {
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
    api.Tag.query({
      notPaged: true
    }, function(err, tags) {
      if (err) {
        return next(err);
      }
      tags = _.groupBy(tags, function(tag) {
        return tag.section.name;
      });

      res.render('topic/edit', {
        tags: tags,
        topic: _.extend(req.topic, req.flash('body')),
        err: req.flash('err')
      });
    });
  } else if ('post' === method) {
    api.Topic.edit(req.body, function(err, topic) {
      if (err) {
        return next(err);
      }
      res.redirect('/topics/' + topic.id);
    });
  }
};

/** 话题详细信息 */
exports.show = function(req, res, next) {
  var pageIndex = parseInt(req.query.pageIndex, 10);
  var pagination = {
    pageIndex: pageIndex,
    pageSize: nconf.get('pagination:pageSize')
  };

  async.parallel({
    topic: function(next) {
      api.Topic.incViews({
        _id: req.topic.id
      }, next);
    },
    isFavorited: function(next) {
      if (!req.isAuthenticated() ||
          req.currentUser.id === req.topic.author.id) {
        return next(null, false);
      }
      api.Topic.getFavoritedState({
        topicId: req.topic.id,
        userId: req.currentUser.id
      }, next);
    },
    comments: function(next) {
      api.Comment.query({
        conditions: {
          refId: req.topic.id
        },
        pageIndex: pageIndex,
        pageSize: nconf.get('pagination:pageSize')
      }, function(err, count, comments) {
        if (err) {
          return next(err);
        }
        pagination.totalCount = count;
        next(null, comments);
      });
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    res.locals.site = res.locals.site || {};
    res.locals.site.title = results.topic.title + ' - ' + nconf.get('site:name');
    res.locals.site.description = results.topic.title;
    res.render('topic/show', _.extend(results, {
      pagination: pagination,
      err: _.extend(req.flash('err'), { global: true })
    }));
  });
};