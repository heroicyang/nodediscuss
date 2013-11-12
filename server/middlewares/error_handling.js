/**
 * 错误处理
 * @author heroic
 */

exports.error404 = function() {
  return function(req, res, next) {
    res.status(404);
    res.format({
      'text/html': function() {

      },
      'application/json': function() {
        res.send({
          error: {
            message: 'Page Not Found.',
            code: 404
          }
        });
      }
    });
  };
};

exports.error500 = function() {
  return function(err, req, res, next) {
    if (err.name === 'ValidationError' || err.name === 'APIError') {
      req.flash('errors', err.errors);
      req.flash('body', req.body);
      res.redirect(req.path);
    }
  };
};