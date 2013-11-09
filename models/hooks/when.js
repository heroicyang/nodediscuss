/**
 * 用于消除繁多的 `if...else...` 判断
 * 尤其是在 pre-hooks 中，每个中间件都可能会有很多判断来确定该中间件是否继续执行
 * Examples:
 *   var when = require('./when');
 *   
 *   // 简单传入对象的属性做判断，该对象依赖 `then` 返回的函数所绑定的上下文
 *   when('isNew').then(function(next) {});
 *   
 *   // `then` 所执行的中间件可以有多个参数
 *   when('isNew').then(function(next, done) {});
 *
 *   // 用于复杂的条件判断时，可以传入一个返回值是 `boolean` 型的函数
 *   // 传入函数所执行时的上下文依然是 `then` 返回的函数所绑定的上下文
 *   when(function() {
 *     return !this.isNew && this.deleted;
 *   }).then(function(next) {});
 *
 *   // 提供 `and` 和 `or`, `not` 方法，不过此处采用的是连续计算( `a && b && !c || d`)，暂...
 *   // ...不支持组合型计算，比如 `(a && b) || c` 这样的暂不支持
 *   when('isNew')
 *     .and('onPage')
 *     .or(function() {
 *       return !this.commentId;
 *     })
 *     .then(function(next) {});
 *
 * @author heroic
 */

/**
 * `When` constructor
 */
function When() {
  this.conditions = {
    and: [],
    or: [],
    not: []
  };
}

/**
 * 原型方法
 * @type {Object}
 */
When.prototype = {
  and: function(condition) {
    if (condition !== 'undefined') {
      this.conditions.and.push(condition);
    }
    return this;
  },
  or: function(condition) {
    if (condition !== 'undefined') {
      this.conditions.or.push(condition);
    }
    return this;
  },
  not: function(condition) {
    if (condition !== 'undefined') {
      this.conditions.not.push(condition);
    }
    return this;
  },
  // 代表本次判断结束，返回一个延迟执行的匿名函数
  then: function(func) {
    var conditions = this.conditions;

    // 返回一个匿名函数（中间件）
    return function(next, done) {
      var args = Array.prototype.slice.call(arguments, 0),
        noop = function() {},
        self = this,
        result = true;

      next = args[0] || noop,
      done = typeof args[1] === 'function' && args[1] || noop;

      conditions.and.forEach(function(andCondition) {
        if (typeof andCondition === 'function') {
          result = result && !!andCondition.call(self);
        } else {
          result = result && !!self[andCondition];
        }
      });

      conditions.or.forEach(function(orCondition) {
        if (typeof orCondition === 'function') {
          result = result || !!orCondition.call(self);
        } else {
          result = result || !!self[orCondition];
        }
      });

      conditions.not.forEach(function(notCondition) {
        if (typeof notCondition === 'function') {
          result = result && !notCondition.call(self);
        } else {
          result = result && !self[notCondition];
        }
      });
      
      if (result) {
        func.apply(this, args);
      } else {
        next();
        done();
      }
    };
  }
};

/**
 * Exports
 * @param  {String|Function} condition 判断条件
 * @return {Object}           When 的一个实例
 */
module.exports = exports = function(condition) {
  var when = new When();
  return when.and(condition);
};