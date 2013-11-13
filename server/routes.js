/**
 * 路由配置
 * @author  heroic
 */

/**
 * Module dependencies
 */
var auth = require('./authorization'),
  userController = require('./controllers/user');
var noopRequestHandler = function(req, res, next) {};

module.exports = exports = function(app) {
  app.get('/', function(req, res) {
    req.breadcrumbs('社区' );
    res.render('topics', {
      err: req.flash('err'),
      showInGlobal: true
    });
  });

  // 用户相关的路由配置
  app.get('/signup', auth.unreachableWhenAuthorized, userController.signup);
  app.post('/signup', auth.unreachableWhenAuthorized, userController.signup);
  app.get('/signin', auth.unreachableWhenAuthorized, userController.signin);
  app.post('/signin', auth.unreachableWhenAuthorized, userController.signin);
  app.get('/active', userController.activate);
  app.get('/user/:username', noopRequestHandler);
  app.get('/setting', noopRequestHandler);
  app.post('/setting', noopRequestHandler);

  // 节点相关的路由配置
  app.get('/tags', noopRequestHandler);  // 获取所有节点
  app.get('/tags/top', noopRequestHandler);  // 获取热门节点
  app.get('/tag/:name', noopRequestHandler);  // 该节点下的所有话题
  app.get('/section/:name/tags', noopRequestHandler);  // 获取该节点组的所有节点

  // 话题相关的路由配置
  app.get('/topic', noopRequestHandler);   // 发布新话题页面
  app.post('/topic', noopRequestHandler);
  app.get('/topics', noopRequestHandler);  // 各种状态的话题列表
  app.get('/topic/:id', noopRequestHandler);  // 详细话题页面
  app.get('/topic/:id/edit', noopRequestHandler); // 话题编辑页面
  app.post('/topic/:id/edit', noopRequestHandler);  // 更新话题
  app.post('/topic/:id/del', noopRequestHandler);  // 删除话题
  app.post('/topic/:id/favorite', noopRequestHandler);  // 收藏话题
  app.post('/topic/:id/favorite/del', noopRequestHandler);  // 取消收藏

  // 评论相关的路由配置
  app.post('/comment', noopRequestHandler);  // 评论话题
  app.post('/comment/:id/reply', noopRequestHandler);  // 回复评论
  app.post('/comment/:id/del', noopRequestHandler);  // 删除评论

  // 通知相关的路由配置
  app.get('/notifications', noopRequestHandler);  // 查看通知的页面

  // 单一文档页面的路由
  app.get('/:slug', noopRequestHandler);
};