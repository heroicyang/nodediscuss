/**
 * 权限拦截器
 * @author heroic
 */

/**
 * 需要登录
 */
exports.authRequired = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.format({
      'text/html': function() {
        res.redirect('/signin');
      },
      'application/json': function() {
        res.send({
          error: {
            message: '你需要先登录后才能继续',
            code: 500
          }
        });
      }
    });
  }
  next();
};

/**
 * 登录后不能访问，会直接跳转到首页
 */
exports.unreachableWhenAuthorized = function(req, res, next) {
  if (req.isAuthenticated()) {
    return res.format({
      'text/html': function() {
        res.redirect('/');
      },
      'application/json': function() {
        res.send({
          error: {
            message: '抱歉，请止步',
            code: 500
          }
        });
      }
    });
  }
  next();
};