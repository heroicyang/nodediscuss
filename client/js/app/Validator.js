/**
 * 表单验证器模块
 * @author heroic
 */

NC.Loader.define('Validator', [], function() {
  /**
   * Validator constructor
   * @param {jQuery} el         需要验证的表单项元素
   * @param {Array} validators  验证器集合，由 Validator 上暴露出去的各种验证器组成
   */
  function Validator(el, validators) {
    this.$el = el;
    this.validators = validators;
  }

  /** 继承自 Backbone.Events */
  _.extend(Validator.prototype, Backbone.Events, {
    /**
     * 遍历挨个调用真正的验证器来进行验证，验证完成之后触发 `validated` 事件
     * @param  {Function} callback 验证完成之后的回调函数
     *  - result
     *    - $el    所验证的表单项元素
     *    - errors 验证失败的提示信息集合
     */
    validate: function(callback) {
      var self = this,
        validatorCount = this.validators.length,
        errors = [];

      _.each(this.validators, function(validator) {
        validator(self.$el, function(result) {
          validatorCount -= 1;
          errors = errors.concat(result.errors);

          if (validatorCount === 0) {
            result = {
              $el: self.$el,
              errors: errors
            };
            self.trigger('validated', result);
            callback && callback(result);
          }
        });
      });
    }
  });

  /**
   * 必填验证器
   * @param {Object} options
   *  - msg    验证失败时的错误提示信息
   */
  Validator.Required = function(options) {
    options = options || {};
    return function(el, callback) {
      var val = el.val(),
        errors = [],
        msg = options.msg || '该项必填!';

      if (('checkbox' === el.attr('type') &&
            'checked' !== el.attr('checked')) || !val) {
        errors.push(msg);
      }

      callback && callback({
        $el: el,
        errors: errors
      });
    };
  };

  /**
   * 字母数字验证器
   * @param {Object} options
   *  - msg    验证失败时的错误提示信息
   */
  Validator.AlphaNumeric = function(options) {
    options = options || {};
    return function(el, callback) {
      var val = el.val(),
        errors = [],
        msg = options.msg || '该项仅支持字母与数字。';

      if (val && !val.match(/^[a-zA-Z0-9\-_]+$/)) {
        errors.push(msg);
      }

      callback && callback({
        $el: el,
        errors: errors
      });
    };
  };

  /**
   * 字符长度验证器
   * @param {Object} options
   *  - msg    验证失败时的错误提示信息
   *  - min    字符长度最小值
   *  - max    字符长度最大值
   */
  Validator.Length = function(options) {
    options = options || {};
    return function(el, callback) {
      var val = el.val(),
        valLen = val.length,
        errors = [],
        max = options.max || Infinity,
        min = options.min || 0,
        msg = options.msg || '该项长度为 %s 至 %s 之间。';

      if (valLen < min || valLen > max) {
        errors.push(format(msg, min, max));
      }

      callback && callback({
        $el: el,
        errors: errors
      });
    };
  };

  /**
   * 电子邮件验证器
   * @param {Object} options
   *  - msg    验证失败时的错误提示信息
   */
  Validator.Email = function(options) {
    options = options || {};
    return function(el, callback) {
      var val = el.val(),
        errors = [],
        msg = options.msg || '不像是有效的电子邮件地址。';

      if (val && !val.match(/.+@.+\..+/gi)) {
        errors.push(msg);
      }

      callback && callback({
        $el: el,
        errors: errors
      });
    };
  };

  /**
   * 简单的字符串格式化函数
   * Examples:
   *    format('a is %s', 1);   // 'a is 1'
   * 
   * @param  {String} str 需要格式化的字符串
   * @return {String}     格式化后的字符串
   */
  function format(str) {
    var values = Array.prototype.slice.call(arguments, 1);
    return str.replace(/%s/g, function() {
      return values.shift();
    });
  }

  return Validator;
});
