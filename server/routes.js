/**
 * 路由配置
 * @author  heroic
 */

/**
 * Module dependencies
 */
var userController = require('./controllers/user');

module.exports = exports = function(app) {
  app.get('/', function(req, res) {
    res.render('topics', {
      page: { title: 'CNode: Node.js 中文社区' }
    });
  });
  app.get('/signup', userController.signup);
  app.post('/signup', userController.signup);
};