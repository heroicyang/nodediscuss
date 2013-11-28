/**
 * 用户收藏列表的逻辑控制
 * @author heroic
 */

/**
 * Module dependencies
 */
var api = require('../../api');

exports.topicList = function(req, res, next) {
  api.favorite.queryFavoriteTopics({
    userId: req.user.id
  }, function(err, topics) {
    if (err) {
      return next(err);
    }
    req.breadcrumbs('话题收藏');
    res.render('favorite_topics', {
      topics: topics
    });
  });
};