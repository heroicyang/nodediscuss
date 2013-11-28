/**
 * 定义 TagSchema 的 pre-hooks
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async');

/** Exports hooks */
module.exports = exports = function(schema) {
  schema
    .pre('remove', function(next) {
      // 删除一个节点时清空该节点下面的所有话题
      // 此操作只有管理员才可以进行，但仍需谨慎
      var Topic = this.model('Topic');
      Topic.find({
        'tag.id': this.id
      }, function(err, topics) {
        if (err) {
          return next(err);
        }

        async.each(topics, function(topic, next) {
          topic.remove(next);
        }, next);
      });
    });
};