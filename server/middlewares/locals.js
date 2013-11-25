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
  constants = require('../../models').constants;

module.exports = exports = function() {
  return function(req, res, next) {
    res.locals = res.locals || {};
    res.locals.path = req.path;
    res.locals.csrfToken = req.csrfToken && req.csrfToken();

    // 设置 breadcrumbs 数据
    res.locals.breadcrumbs = req.breadcrumbs();

    res.locals.page = {};
    res.locals.page.name = config.name;
    res.locals.page.title = config.title;
    res.locals.page.description = config.description;
    res.locals.assets = assets;

    res.locals.constants = constants;

    res.locals.isAuthenticated = req.isAuthenticated();
    if (req.isAuthenticated()) {
      var simpledUser = _.pick(req.user, [
        '_id', 'username', 'nickname', 'avatar', 'topicCount',
        'wikiCount', 'followerCount', 'followingCount',
        'favoriteTopicCount', 'favoriteTagCount'
      ]);
      simpledUser.id = req.user.id;
      res.locals.loggedUser = simpledUser;
      res.locals.loggedUserJson = JSON.stringify(simpledUser);
    }

    res.locals.path = req.path;
    res.locals.query = req.query;
    
    res.locals._ = _;
    res.locals.moment = moment;
    next();
  };
};