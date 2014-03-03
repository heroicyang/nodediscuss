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
  moment = require('moment'),
  nconf = require('nconf');
var constants = require('../api').constants,
  assets = require('../../assets.json'),
  pkg = require('../../package.json');

module.exports = exports = function() {
  return function(req, res, next) {
    res.locals = res.locals || {};
    // helper
    res.locals._ = _;
    res.locals.moment = moment;
    res.locals.gravatar = function(emailHash) {
      var provider = url.format(nconf.get('avatarProvider')),
        avatarSize = nconf.get('avatarProvider:size');
      return util.format(provider, emailHash, avatarSize);
    };

    res.locals.path = req.path;
    res.locals.csrfToken = req.csrfToken && req.csrfToken();
    res.locals.constants = constants;

    res.locals.pkg = {
      name: pkg.name,
      title: pkg.title,
      homepage: pkg.homepage,
      version: pkg.version
    };
    res.locals.site = _.extend({
      domain: 'http://' + nconf.get('host'),
      weiboAppKey: nconf.get('weiboAppKey')
    }, nconf.get('site'));
    res.locals.assets = assets;
    res.locals.staticDomain = nconf.get('static:domain');

    res.locals.isAuthenticated = req.isAuthenticated();
    if (req.isAuthenticated()) {
      if (_.contains(nconf.get('adminEmails'), req.currentUser.email)) {
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
