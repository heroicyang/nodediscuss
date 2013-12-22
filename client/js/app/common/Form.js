/**
 * 具备验证功能的表单模块
 * @author heroic
 */

NC.Loader.define('Form', ['Validator'], function(Validator) {
  /**
   * Form constructor
   * @param {jQuery Element} form    表单
   * @param {Object} rules   验证规则
   *  {
   *    'input name attribute': [
   *      Validator.Required(),
   *      ...各种验证器
   *    ]
   *  } 
   * @param {Object} options 配置项
   *  - isErrMsgOnHelpBlock   将各表单项验证失败的错误信息增加到该项对应的 `help-block` 中
   *                          默认为 `true`，设置为 `false` 就不增加
   *  - isErrClassOnParent    将错误样式添加到表单项的父级元素，默认为 `true`
   *                          `false` 则代表添加到当前元素
   *  - errClassEl            如果既不想将错误样式添加到父级元素，也不想添加到当前元素
   *                          可以自定义错误样式添加到的元素，将通过 `$el.closest(errClassEl)` 来查找
   *                          并将错误样式添加到查找到的元素上
   */
  function Form(form, rules, options) {
    var self = this;
    form.off('submit');
    this.$el = form;
    this.validators = {};
    this.results = [];

    options = options || {};
    if (typeof options.isErrMsgOnHelpBlock === 'undefined') {
      options.isErrMsgOnHelpBlock = true;
    }
    if (typeof options.isErrClassOnParent === 'undefined') {
      options.isErrClassOnParent = true;
    }
    this.options = options;

    // 禁用 HTML5 的验证
    if (!this.$el.attr('novalidate')) {
      this.$el.attr('novalidate', 'true');
    }

    _.each(rules, function(validators, el) {
      var $el = form.find('[name="' + el + '"]'),
        validator = new Validator($el, validators);
      self.validators[el] = validator;
      validator.on('validated', _.bind(validateCompleted, self));

      $el.on('focus', function() {
        if (self.options.isErrMsgOnHelpBlock){
          $el.next('.help-block.error').remove();
          $el.next('.help-block').show();
        }

        if (self.options.errClassEl) {
          $el.closest(self.options.errClassEl).removeClass('has-error');
        } else if (self.options.isErrClassOnParent) {
          $el.parent().removeClass('has-error');
        } else {
          $el.removeClass('has-error');
        }
      });
    });

    form.submit(function() {
      self.results = [];
      self.validate(function() {
        if (self.hasErrors()) {
          return self.trigger('invalidated', self.results);
        }
        self.trigger('validated');
      });
      return false;
    });
  }

  _.extend(Form.prototype, Backbone.Events, {
    validate: function(callback) {
      var validatorCount = _.size(this.validators),
        self = this;

      _.each(this.validators, function(validator) {
        validator.validate(function(result) {
          validatorCount -= 1;
          self.results.push(result);

          if (validatorCount === 0) {
            callback && callback();
          }
        });
      });
    },
    hasErrors: function() {
      var errorResult = _.filter(this.results, function(result) {
        return result.errors.length > 0;
      });
      return _.size(errorResult) > 0;
    }
  });

  function validateCompleted(result) {
    var $el = result.$el,
      errors = result.errors;

    if (errors[0]) {
      if (this.options.isErrMsgOnHelpBlock) {
        $el.next('.help-block.error').remove();
        $el.next('.help-block').hide();
        $el.after('<span class="help-block error">' + errors[0] + '</span>');
      }
      
      if (this.options.errClassEl) {
        $el.closest(this.options.errClassEl).addClass('has-error');
      } else if (this.options.isErrClassOnParent) {
        $el.parent().addClass('has-error');
      } else {
        $el.addClass('has-error');
      }
    } else {
      if (this.options.isErrMsgOnHelpBlock) {
        $el.next('.help-block.error').remove();
        $el.next('.help-block').show();
      }
      
      if (this.options.errClassEl) {
        $el.closest(this.options.errClassEl).removeClass('has-error');
      } else if (this.options.isErrClassOnParent) {
        $el.parent().removeClass('has-error');
      } else {
        $el.removeClass('has-error');
      }
    }
  }

  return Form;
});
