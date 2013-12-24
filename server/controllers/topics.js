/**
 * 话题相关的控制逻辑
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash');
var config = require('../../config'),
  api = require('../api');
var error = require('../utils/error'),
  NotFoundError = error.NotFoundError;

/** 社区页面话题列表 */
exports.home = function(req, res, next) {
  var filter = req.params.type,
    pageIndex = parseInt(req.query.pageIndex, 10);

  var error = _.extend(req.flash('err'), {
    global: true
  });
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
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
        pageSize: config.pagination.pageSize
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

    req.breadcrumbs('社区');
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
    filter = req.params.type,
    pageIndex = parseInt(req.query.pageIndex, 10);

  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
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
        pageSize: config.pagination.pageSize
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

    req.breadcrumbs(req.tag.name);
    res.render('topic/list', _.extend(results, {
      pagination: pagination,
      tag: req.tag,
      url: '/tag/' + req.tag.slug + '/topics',
      filterType: filter
    }));
  });
};

/** 用户发布的话题列表 */
exports.createdByUser = function(req, res, next) {
  var pageIndex = parseInt(req.query.pageIndex, 10);
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  };

  api.Topic.query({
    conditions: {
      'author.id': req.user.id
    },
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
  }, function(err, count, topics) {
    if (err) {
      return next(err);
    }

    pagination.totalCount = count;
    
    req.breadcrumbs(req.user.nickname, '/user/' + req.user.username);
    req.breadcrumbs('全部话题');
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
    pageSize: config.pagination.pageSize
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
        pageSize: config.pagination.pageSize
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

    req.breadcrumbs('我关注的人发布的最新话题');
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
      req.breadcrumbs('发布新话题');
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

      req.breadcrumbs('话题详情', '/topic/' + req.topic._id);
      req.breadcrumbs('编辑话题');
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
      res.redirect('/topic/' + topic.id);
    });
  }
};

/** 话题详细信息 */
exports.show = function(req, res, next) {
  var pageIndex = parseInt(req.query.pageIndex, 10);
  var pagination = {
    pageIndex: pageIndex,
    pageSize: config.pagination.pageSize
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
        pageSize: config.pagination.pageSize
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
    req.breadcrumbs(req.topic.tag.name, '/tag/' + req.topic.tag.slug);
    req.breadcrumbs('话题详情');

    res.locals.site = res.locals.site || {};
    res.locals.site.title = results.topic.title + ' - ' + config.name;
    res.locals.site.description = results.topic.title;
    res.render('topic/show', _.extend(results, {
      pagination: pagination,
      err: _.extend(req.flash('err'), { global: true })
    }));
  });
};