/**
 * 路由配置
 * @author heroic
 */

/**
 * Module dependencies
 */
var api = require('./api'),
  auth = require('./middlewares/auth');
var uploader = require('./uploader');
var user = require('./controllers/user'),
  tags = require('./controllers/tags'),
  topics = require('./controllers/topics'),
  comments = require('./controllers/comments'),
  favorites = require('./controllers/favorites'),
  notifications = require('./controllers/notifications'),
  pages = require('./controllers/pages');

var admin = {
  dashboard: require('./controllers/admin/dashboard'),
  section: require('./controllers/admin/section'),
  tag: require('./controllers/admin/tag'),
  user: require('./controllers/admin/user'),
  topic: require('./controllers/admin/topic'),
  page: require('./controllers/admin/page')
};

module.exports = exports = function(app) {
  // 文件上传
  app.all('/upload/:type', auth.loginRequired);
  app.post('/upload/image', uploader.uploadImageHandler);

  // 用户
  app.all('/signup', auth.loginNotAllowed, user.signup);
  app.all('/signin', auth.loginNotAllowed, user.signin);
  app.get('/active', user.activate);
  app.post('/logout', auth.loginRequired, user.logout);
  app.all('/forgot', user.forgot);
  app.all('/reset', user.resetPassword);

  app.all('/user/:username/:op?', user.load);
  app.get('/user/:username', user.get);
  app.get('/user/:username/topics', topics.createdByUser);
  app.get('/user/:username/comments', comments.createdByUser);
  app.post('/user/:username/:op', auth.loginRequired);
  // 关注的相关操作直接调用 api
  app.post('/user/:username/follow',
      api.requestHandler(api.Relation.add, true));
  app.post('/user/:username/unfollow',
      api.requestHandler(api.Relation.destroy, true));
  app.get('/user/:username/repos', user.repos);

  // 用户设置
  app.all('/settings/:op?', auth.loginRequired);
  app.get('/settings', user.settings);
  app.post('/settings/profile', user.settings);
  app.post('/settings/change_pass', user.changePass);

  // 提醒
  app.all('/notifications/:op?', auth.loginRequired);
  app.get('/notifications', notifications.index);
  app.post('/notifications/read', notifications.read);

  // 话题列表
  app.get('/', topics.home);
  app.get('/topics/:type?', topics.home);
  app.get('/tag/:slug', tags.load, topics.belongsTag);
  app.get('/tag/:slug/topics/:type?', tags.load, topics.belongsTag);
  app.get('/following/topics', auth.loginRequired, topics.createdByFriends);

  // 单个话题
  app.all('/topic/create', auth.loginRequired);
  app.get('/topic/create', topics.create);
  app.post('/topic/create', auth.topicThrottling, topics.create);
  app.get('/topic/:id', topics.load, topics.show);
  app.all('/topic/:id/:op', auth.loginRequired, topics.load);
  app.all('/topic/:id/edit', auth.topicAuthorRequired, topics.edit);

  // 收藏相关操作直接调用 api
  app.post('/topic/:id/favorite',
      api.requestHandler(api.User.favoriteTopic, true));
  app.post('/topic/:id/unfavorite',
      api.requestHandler(api.User.unfavoriteTopic, true));
  app.post('/tag/:slug/:op', auth.loginRequired, tags.load);
  app.post('/tag/:slug/favorite',
      api.requestHandler(api.User.favoriteTag, true));
  app.post('/tag/:slug/unfavorite',
      api.requestHandler(api.User.unfavoriteTag, true));
  // 收藏列表
  app.get('/favorite/:type', auth.loginRequired);
  app.get('/favorite/topics', favorites.topics);
  app.get('/favorite/tags', favorites.tags);

  // 评论
  app.post('/comments/create', auth.loginRequired, comments.create);
  // 删除评论直接调用 api
  app.post('/comments/:id/remove', auth.loginRequired, comments.load,
      auth.commentAuthorRequired, api.requestHandler(api.Comment.destroy));

  app.get('/wiki', pages.wikis);
  app.all('/wiki/create', auth.loginRequired, auth.wikiEditorRequired, pages.createWiki);
  app.all('/wiki/:slug/edit', auth.loginRequired, auth.wikiEditorRequired, pages.editWiki);

  // 后台管理
  app.all('/admin/:cate?/*/:op?', auth.loginRequired, auth.adminRequired);
  app.get('/admin', admin.dashboard.index);
  app.get('/admin/sections', admin.section.index);
  app.all('/admin/sections/create', admin.section.create);
  app.all('/admin/sections/:id/edit', admin.section.edit);
  app.post('/admin/sections/:id/remove',
      api.requestHandler(api.Section.destroy));
  app.get('/admin/tags', admin.tag.index);
  app.all('/admin/tags/create', admin.tag.create);
  app.all('/admin/tags/:slug/edit', admin.tag.edit);
  app.post('/admin/tags/:id/remove',
      api.requestHandler(api.Tag.destroy));
  app.get('/admin/users', admin.user.index);
  app.post('/admin/users/:id/verify',
      api.requestHandler(api.User.setVerified));
  app.post('/admin/users/:id/block',
      api.requestHandler(api.User.changeState));
  app.get('/admin/topics', admin.topic.index);
  app.all('/admin/topics/:id/edit', admin.topic.edit);
  app.post('/admin/topics/:id/excellent',
      api.requestHandler(api.Topic.setExcellent));
  app.post('/admin/topics/:id/remove',
      api.requestHandler(api.Topic.destroy));
  app.get('/admin/pages', admin.page.index);
  app.all('/admin/pages/create', admin.page.create);
  app.all('/admin/pages/:id/edit', admin.page.edit);
  app.post('/admin/pages/:id/remove',
      api.requestHandler(api.Page.destroy));

  app.get(/^\/([a-zA-Z0-9_\-\/]+)\/?/, pages.get);
};