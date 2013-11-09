module.exports = exports = function(app) {
  app.get('/', function(req, res) {
    res.render('topics', {
      page: { title: 'CNode: Node.js 中文社区' }
    });
  });
  app.get('/signup', function(req, res) {
    res.render('signup', {
      page: { title: 'CNode: Node.js 中文社区 > 注册' }
    });
  });
};