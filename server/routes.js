/**
 * 路由配置
 * @author heroic
 */

/**
 * Module dependencies
 */
var api = require('../api'),
  auth = require('./middlewares/auth'),
  upload = require('./controllers/upload'),
  user = require('./controllers/user'),
  settings = require('./controllers/settings'),
  topics = require('./controllers/topics'),
  tag = require('./controllers/tag'),
  topic = require('./controllers/topic'),
  comment = require('./controllers/comment'),
  favorite = require('./controllers/favorite'),
  notification = require('./controllers/notification'),
  pages = require('./controllers/pages');

var admin = {};
admin.dashboard = require('./controllers/admin/dashboard');
admin.section = require('./controllers/admin/section');
admin.tag = require('./controllers/admin/tag');
admin.user = require('./controllers/admin/user');
admin.topic = require('./controllers/admin/topic');

module.exports = exports = function(app) {
  // 文件上传
  app.all('/upload/:type', auth.isLogin);
  app.post('/upload/image', upload.uploadImage);

  // 用户
  app.all('/signup', auth.unLogin, user.signup);
  app.all('/signin', auth.unLogin, user.signin);
  app.get('/active', user.activate);
  app.post('/logout', auth.isLogin, user.logout);
  app.all('/forgot', user.forgotPassword);
  app.all('/reset', user.resetPassword);

  app.all('/user/:username/:op?', user.load);
  app.get('/user/:username', user.get);
  app.get('/user/:username/topics', topics.byUser);
  app.get('/user/:username/comments', user.comments);
  app.post('/user/:username/:op', auth.isLogin);
  // 关注的相关操作直接调用 api
  app.post('/user/:username/follow',
      api.requestHandler(api.relation.create));
  app.post('/user/:username/unfollow',
      api.requestHandler(api.relation.remove));
  app.get('/user/:username/repos',
      api.requestHandler(api.user.githubRepos));

  // 用户设置
  app.all('/settings/:op?', auth.isLogin);
  app.get('/settings', settings.get);
  app.post('/settings/profile', settings.profile);
  app.post('/settings/change_pass', settings.changePassword);

  // 提醒
  app.all('/notifications/:op?', auth.isLogin);
  app.get('/notifications', notification.list);
  app.post('/notifications/read', notification.read);

  // 话题列表
  app.get('/', topics.list);
  app.get('/topics/:type?', topics.list);
  app.get('/tag/:slug', tag.load, tag.topics);
  app.get('/tag/:slug/topics/:type?', tag.load, tag.topics);
  app.get('/following/topics', auth.isLogin, topics.byFollowing);

  // 单个话题
  app.all('/topic/create', auth.isLogin);
  app.get('/topic/create', topic.create);
  app.post('/topic/create', auth.limitedTopic, topic.create);
  app.get('/topic/:id', topic.load, topic.get);
  app.all('/topic/:id/:op', auth.isLogin, topic.load);
  app.all('/topic/:id/edit', auth.isTopicAuthor, topic.edit);
  app.post('/topic/:id/remove', auth.isTopicAuthor, topic.remove);

  // 收藏相关操作直接调用 api
  app.post('/topic/:id/favorite',
      api.requestHandler(api.favoriteTopic.create));
  app.post('/topic/:id/unfavorite',
      api.requestHandler(api.favoriteTopic.remove));
  app.post('/tag/:slug/:op', auth.isLogin, tag.load);
  app.post('/tag/:slug/favorite',
      api.requestHandler(api.favoriteTag.create));
  app.post('/tag/:slug/unfavorite',
      api.requestHandler(api.favoriteTag.remove));
  // 收藏列表
  app.get('/favorite/:type', auth.isLogin);
  app.get('/favorite/topics', favorite.topics);
  app.get('/favorite/tags', favorite.tags);

  // 评论
  app.post('/comment/create', auth.isLogin, comment.create);
  // 删除评论直接调用 api
  app.post('/comment/:id/remove', auth.isLogin, comment.load,
      auth.isCommentAuthor, api.requestHandler(api.comment.remove));

  app.get('/wiki', pages.wikis);
  app.all('/wiki/create', auth.isLogin, auth.isWikiEditor, pages.createWiki);
  app.all('/wiki/:slug/edit', auth.isLogin, auth.isWikiEditor, pages.editWiki);

  // 后台管理
  app.all('/admin/:cate?/*/:op?', auth.isLogin, auth.isAdmin);
  app.get('/admin', admin.dashboard.index);
  app.get('/admin/sections', admin.section.index);
  app.all('/admin/sections/create', admin.section.create);
  app.all('/admin/sections/:id/edit', admin.section.edit);
  app.post('/admin/sections/:id/remove',
      api.requestHandler(api.section.remove));
  app.get('/admin/tags', admin.tag.index);
  app.all('/admin/tags/create', admin.tag.create);
  app.all('/admin/tags/:slug/edit', admin.tag.edit);
  app.post('/admin/tags/:id/remove',
      api.requestHandler(api.tag.remove));
  app.get('/admin/users', admin.user.index);
  app.post('/admin/users/:id/verify',
      api.requestHandler(api.user.toggleVerified));
  app.post('/admin/users/:id/block',
      api.requestHandler(api.user.toggleBlocked));
  app.get('/admin/topics', admin.topic.index);
  app.post('/admin/topics/:id/excellent',
      api.requestHandler(api.topic.toggleExcellent));
  app.post('/admin/topics/:id/remove',
      api.requestHandler(api.topic.remove));

  app.get(/^\/([a-zA-Z0-9_\-\/]+)\/?/, pages.get);
};