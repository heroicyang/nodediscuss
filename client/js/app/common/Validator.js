/**
 * 表单验证器模块
 * @author heroic
 */

ND.Loader.define('Validator', [], function() {
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
        validator(self.$el, function(error) {
          validatorCount -= 1;
          if (error) {
            errors.push(error);
          }

          if (validatorCount === 0) {
            var result = {
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
   *  - klass    验证失败时的样式
   */
  Validator.Required = function(options) {
    options = options || {};
    return function(el, callback) {
      var val = el.val(),
        klass = options.klass || 'required',
        error;

      if (('checkbox' === el.attr('type') &&
            'checked' !== el.attr('checked')) || !val) {
        error = {
          $el: el,
          klass: klass
        };
      }

      callback && callback(error);
    };
  };

  /**
   * 字母数字验证器
   * @param {Object} options
   *  - klass    验证失败时的样式
   */
  Validator.AlphaNumeric = function(options) {
    options = options || {};
    return function(el, callback) {
      var val = el.val(),
        klass = options.klass || 'alpha-numeric',
        error;

      if (val && !val.match(/^[a-zA-Z0-9\-_]+$/)) {
        error = {
          $el: el,
          klass: klass
        };
      }

      callback && callback(error);
    };
  };

  /**
   * 字符长度验证器
   * @param {Object} options
   *  - klass  验证失败时的样式
   *  - min    字符长度最小值
   *  - max    字符长度最大值
   */
  Validator.Length = function(options) {
    options = options || {};
    return function(el, callback) {
      var val = el.val(),
        valLen = val.length,
        max = options.max || Infinity,
        min = options.min || 0,
        klass = options.klass || 'length',
        error;

      if (valLen < min || valLen > max) {
        error = {
          $el: el,
          klass: klass
        };
      }

      callback && callback(error);
    };
  };

  /**
   * 电子邮件验证器
   * @param {Object} options
   *  - klass    验证失败时的样式
   */
  Validator.Email = function(options) {
    options = options || {};
    return function(el, callback) {
      var val = el.val(),
        klass = options.klass || 'email',
        error;

      if (val && !val.match(/.+@.+\..+/gi)) {
        error = {
          $el: el,
          klass: klass
        };
      }

      callback && callback(error);
    };
  };

  return Validator;
});
