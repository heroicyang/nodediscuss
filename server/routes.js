module.exports = exports = function(app) {
  app.get('/', function(req, res) {
    res.render('index', {
      page: { title: 'Node.js 中文社区' }
    });
  });
  app.get('/signup', function(req, res) {
    res.render('signup', {
      page: { title: 'Node.js 中文社区 > 注册' }
    });
  });
};