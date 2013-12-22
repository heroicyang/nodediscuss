/**
 * 错误处理
 * @author heroic
 */

exports.error404 = function() {
  return function(req, res) {
    res.status(404);
    res.format({
      'text/html': function() {
        res.render('404');
      },
      'application/json': function() {
        res.send({
          error: {
            message: 'Page Not Found.'
          }
        });
      }
    });
  };
};

exports.error500 = function() {
  return function(err, req, res, next) {
    if (err.status === 404) {
      return next();
    }
    console.log(err.stack);

    if (err.name === 'ValidationError' ||
          err.name === 'NotAllowedError' ||
          err.name === 'CentralizedError') {
      var redirectPath = req.flash('redirectPath') || req.path;
      req.flash('err', err);
      req.flash('body', req.body);
      return res.format({
        'text/html': function() {
          res.redirect(redirectPath);
        },
        'application/json': function() {
          res.send({
            error: err
          });
        }
      });
    }

    res.status(err.status || 500);
    res.format({
      'text/html': function() {
        res.render('500', {
          error: err
        });
      },
      'application/json': function() {
        res.send({
          error: err
        });
      }
    });
  };
};