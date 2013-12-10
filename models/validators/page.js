/**
 * PageSchema validators
 * @author heroic
 */

module.exports = exports = function(schema) {
  schema.path('slug')
    .required(true, '页面地址不能为空!')
    .match(/^[a-zA-Z0-9\-_\/]+$/, '无效的页面地址! 仅支持字母、数字、_ 以及 - 。')
    .validate(function(slug, done) {
      var Page = this.model('Page'),
        self = this;
      Page.findOne({
        slug: slug
      }, function(err, page) {
        if (err) {
          return done(false);
        }
        if (page) {
          return done(page.slug === self.slug);
        }
        done(true);
      });
    }, '该页面地址已被使用。');

  schema.path('title')
    .required(true, '页面标题不能为空!')
    .validate(function(title) {
      return title.length <= 100;
    }, '页面标题不能超过 100 个字符。');

  schema.path('content')
    .required(true, '页面内容不能为空!');
};