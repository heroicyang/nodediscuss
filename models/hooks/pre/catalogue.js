/**
 * 定义 CatalogueSchema 的 pre-hooks
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async');

/**
* Bootstrap
* @param  {Mongoose.Schema} schema
*/
module.exports = exports = function(schema) {
  schema
    .pre('remove', removeAllTopics);
};

/**
 * 删除节点下面的所有话题
 */
function removeAllTopics(next) {
  var Topic = this.model('Topic');
  Topic.find({
    'catalogue.id': this.id
  }, function(err, topics) {
    if (err) {
      return next(err);
    }

    async.each(topics, function(topic, next) {
      topic.remove(next);
    }, next);
  });
}