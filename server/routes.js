/**
 * 路由配置
 * @author  heroic
 */

/**
 * Module dependencies
 */
var uploader = require('../utils/uploader'),
  auth = require('./authorization'),
  controllers = require('./controllers'),
  uploadController = controllers.upload,
  userController = controllers.user,
  topicController = controllers.topic,
  commentController = controllers.comment,
  notificationController = controllers.notification;
var noopRequestHandler = function(req, res, next) {};

module.exports = exports = function(app) {
  // 上传文件
  app.post('/upload/image', auth.authRequired, uploadController.uploadImage);

  app.get('/', topicController.index);

  // 用户相关的路由配置
  app.get('/signup', auth.unreachableWhenAuthorized, userController.signup);
  app.post('/signup', auth.unreachableWhenAuthorized, userController.signup);
  app.get('/signin', auth.unreachableWhenAuthorized, userController.signin);
  app.post('/signin', auth.unreachableWhenAuthorized, userController.signin);
  app.post('/logout', auth.authRequired, userController.logout);
  app.get('/active', userController.activate);
  app.get('/user/:username', userController.index);
  app.get('/settings', auth.authRequired, userController.settings);
  app.post('/settings', auth.authRequired, userController.settings);

  // 话题相关的路由配置
  app.get('/topic/create', auth.authRequired, topicController.create);
  app.post('/topic/create', auth.authRequired, topicController.create);
  app.get('/tag/:name', topicController.queryByTag);  // 该节点下的所有话题
  app.get('/topics', topicController.index);
  app.get('/topic/:id', topicController.get);  // 详细话题页面
  app.get('/topic/:id/edit', noopRequestHandler); // 话题编辑页面
  app.post('/topic/:id/edit', noopRequestHandler);  // 更新话题
  app.post('/topic/:id/del', noopRequestHandler);  // 删除话题
  app.post('/topic/:id/favorite', noopRequestHandler);  // 收藏话题
  app.post('/topic/:id/favorite/del', noopRequestHandler);  // 取消收藏

  // 评论相关的路由配置
  app.post('/comment/create', auth.authRequired, commentController.create);  // 评论话题
  app.post('/comment/:id/reply', noopRequestHandler);  // 回复评论
  app.post('/comment/:id/del', noopRequestHandler);  // 删除评论

  // 通知相关的路由配置
  app.get('/notifications', auth.authRequired, notificationController.index);  // 查看通知的页面

  // 单一文档页面的路由
  // app.get('/:slug', noopRequestHandler);
};