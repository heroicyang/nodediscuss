/**
 * 设置每次请求都会用到的本地变量
 * @author heroic
 */

/**
 * Module dependencies
 */
var url = require('url'),
  util = require('util');
var _ = require('lodash'),
  moment = require('moment');
var config = require('../../config'),
  constants = require('../api').constants,
  assets = require('../../assets.json'),
  pkg = require('../../package.json');

module.exports = exports = function() {
  return function(req, res, next) {
    res.locals = res.locals || {};
    // helper
    res.locals._ = _;
    res.locals.moment = moment;
    res.locals.gravatar = function(emailHash) {
      var provider = url.format(config.avatarProvider),
        avatarSize = config.avatarProvider.size;
      return util.format(provider, emailHash, avatarSize);
    };

    res.locals.path = req.path;
    res.locals.csrfToken = req.csrfToken && req.csrfToken();
    // 设置 breadcrumbs 数据
    res.locals.breadcrumbs = req.breadcrumbs();
    res.locals.constants = constants;

    res.locals.pkg = {
      title: pkg.title,
      homepage: pkg.homepage,
      version: pkg.version
    };
    res.locals.site = {
      domain: 'http://' + config.host,
      logo: config.logo,
      name: config.name,
      title: config.title,
      description: config.description,
      headers: config.headers,
      footerNavs: config.footerNavs,
      links: config.links,
      ads: config.ads
    };
    res.locals.assets = assets;
    res.locals.staticDomain = config.static.domain;

    res.locals.isAuthenticated = req.isAuthenticated();
    if (req.isAuthenticated()) {
      if (_.contains(config.adminEmails, req.currentUser.email)) {
        req.currentUser.isAdmin = true;
      }
      res.locals.currentUser = req.currentUser;

      var currentUser = _.pick(req.currentUser, [
        '_id', 'username', 'nickname', 'emailHash', 'topicCount',
        'followerCount', 'followingCount', 'favoriteTopicCount', 'favoriteTagCount'
      ]);
      currentUser.id = req.currentUser.id;
      res.locals.currentUserJson = JSON.stringify(currentUser);
    }

    next();
  };
};