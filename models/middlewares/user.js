/**
 * UserSchema middlewares
 * @author heroic
 */

/**
 * Module dependencies
 */
var xss = require('../xss');

module.exports = exports = function(schema) {
  // 执行数据验证之前的中间件
  schema
    .pre('validate', function(next) {
      // 对用户输入的字段进行 xss 过滤
      xss(this, [
        'nickname', 'tagline', 'bio', 'location',
        'weibo', 'twitter', 'github'
      ]);

      if (!this.nickname) {
        this.nickname = this.username;
      }
      next();
    });

  // 执行数据保存操作之前的中间件
  schema
    .pre('save', true, function(next, done) {
      next();
      // 如果更新了用户的昵称，则同步更新其话题的 author 副本信息
      if (this.isNew || !this.isModified('nickname')) {
        return done();
      }

      var Topic = this.model('Topic');
      Topic.update({
        'author.id': this.id
      }, {
        'author.nickname': this.nickname
      }, {
        multi: true
      }, done);
    })
    .pre('save', true, function(next, done) {
      next();
      // 如果更新了用户的昵称，则同步更新其评论的 author 副本信息
      if (this.isNew || !this.isModified('nickname')) {
        return done();
      }
      
      var Comment = this.model('Comment');
      Comment.update({
        'author.id': this.id
      }, {
        'author.nickname': this.nickname
      }, {
        multi: true
      }, done);
    });
};