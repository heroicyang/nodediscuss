/**
 * 只有文档是新创建的时候才去执行中间件
 * @param  {Function}  middleware 需要执行的中间件
 * @return {Function}  包装后的中间件
 */
exports.whenNewThen = function(middleware) {
  return function(next, done) {
    var args = Array.prototype.slice.call(arguments, 0),
      noop = function() {};

    next = args[0] || noop,
    done = typeof args[1] === 'Function' && args[1] || noop;

    if (this.isNew) {
      middleware.apply(this, args);
    } else {
      next();
      done();
    }
  };
};