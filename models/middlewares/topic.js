/**
 * TopicSchema middlewares
 * @author heroic
 */

/**
 * Module dependencies
 */
var xss = require('../xss');

module.exports = exports = function(schema) {
  // 执行数据验证之前
  schema
    .pre('validate', function(next) {
      xss(this, ['title', 'contentHtml']);
      next();
    });

  // 执行数据保存之前
  schema
    .pre('save', true, function(next, done) {
      next();
      // 创建话题时更新其作者的话题数量属性
      if (!this.isNew) { return done(); }

      var User = this.model('User');
      User.findByIdAndUpdate(this.author.id, {
        $inc: {
          topicCount: 1
        }
      }, done);
    })
    .pre('save', true, function(next, done) {
      next();
      // 创建话题时更新其所属节点的话题数量属性
      if (!this.isNew) { return done(); }

      var Tag = this.model('Tag');
      Tag.findByIdAndUpdate(this.tag.id, {
        $inc: {
          topicCount: 1
        }
      }, done);
    });

  // 执行数据删除之前
  schema
    .pre('remove', true, function(next, done) {
      next();
      // 删除话题时更新其作者的话题数量属性
      var User = this.model('User');
      User.findByIdAndUpdate(this.author.id, {
        $inc: {
          topicCount: -1
        }
      }, done);
    })
    .pre('remove', true, function(next, done) {
      next();
      // 删除话题时更新其所属节点的话题数量属性
      var Tag = this.model('Tag');
      Tag.findByIdAndUpdate(this.tag.id, {
        $inc: {
          topicCount: -1
        }
      }, done);
    });
};