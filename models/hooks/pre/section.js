/**
 * 定义 SectionSchema 的 pre-hooks
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
    .pre('remove', removeAllTags);
};

/**
 * 删除节点域下面的所有节点
 */
function removeAllTags(next) {
  var Tag = this.model('Tag');
  Tag.find({
    'section.id': this.id
  }, function(err, tags) {
    if (err) {
      return next(err);
    }

    async.each(tags, function(tag, next) {
      tag.remove(next);
    }, next);
  });
}