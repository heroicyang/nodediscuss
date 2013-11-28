/**
 * 定义 TopicSchema 的 pre-hooks
 * @author heroic
 */

/**
* Module dependencies
*/
var sanitize = require('validator').sanitize;

/** Exports hooks */
module.exports = exports = function(schema) {
  // 验证之前先处理输入的数据
  schema
    .pre('validate', function(next) {
      this.title = sanitize(this.title).xss();
      this.content = sanitize(this.content).xss();
      next();
    });

  // 创建话题时需要做以下操作
  schema
    .pre('save', true, function(next, done) {
      next();
      // 增加更新对应用户的话题数量，只在创建时更新
      if (!this.isNew) {
        return done();
      }

      var User = this.model('User');
      User.findByIdAndUpdate(this.author.id, {
        $inc: {
          topicCount: 1
        }
      }, done);
    })
    .pre('save', true, function(next, done) {
      next();
      // 增加对应节点的话题数量，只在创建时更新
      if (!this.isNew) {
        return done();
      }
      
      var Tag = this.model('Tag');
      Tag.findByIdAndUpdate(this.tag.id, {
        $inc: {
          topicCount: 1
        }
      }, done);
    });

  // 删除话题时需要做以下操作
  schema
    .pre('remove', true, function(next, done) {
      next();
      // 减少对应用户的话题数量
      var User = this.model('User');
      User.findByIdAndUpdate(this.author.id, {
        $inc: {
          topicCount: -1
        }
      }, done);
    })
    .pre('remove', true, function(next, done) {
      next();
      // 减少对应节点的话题数量
      var Tag = this.model('Tag');
      Tag.findByIdAndUpdate(this.tag.id, {
        $inc: {
          topicCount: -1
        }
      }, done);
    });
};