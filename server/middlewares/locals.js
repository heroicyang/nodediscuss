/**
 * 设置每次请求都会用到的本地变量
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash'),
  moment = require('moment'),
  config = require('../../config'),
  assets = require('../../assets.json'),
  constants = require('../../models').constants,
  version = require('../../package.json').version;

module.exports = exports = function() {
  return function(req, res, next) {
    res.locals = res.locals || {};
    res.locals.path = req.path;
    res.locals.csrfToken = req.csrfToken && req.csrfToken();
    res.locals.version = version;

    // 设置 breadcrumbs 数据
    res.locals.breadcrumbs = req.breadcrumbs();

    res.locals.site = {};
    res.locals.site.name = config.name;
    res.locals.site.title = config.title;
    res.locals.site.description = config.description;
    res.locals.assets = assets;

    res.locals.constants = constants;

    res.locals.isAuthenticated = req.isAuthenticated();
    if (req.isAuthenticated()) {
      var currentUser = _.pick(req.currentUser, [
        '_id', 'username', 'nickname', 'avatar', 'topicCount',
        'wikiCount', 'followerCount', 'followingCount',
        'favoriteTopicCount', 'favoriteTagCount'
      ]);
      currentUser.id = req.currentUser.id;
      res.locals.currentUser = req.currentUser;
      res.locals.currentUserJson = JSON.stringify(currentUser);
    }
    
    res.locals._ = _;
    res.locals.moment = moment;
    next();
  };
};