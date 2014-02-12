/**
 * 具备验证功能的表单模块
 * @author heroic
 */

ND.Loader.define('Form', ['Validator'], function(Validator) {
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
   *  - klass            错误时的样式名称（默认是__error__）
   *  - isKlassOnParent  错误时__klass__是添加到表单项还是其父元素（默认是当前表单项）
   */
  function Form(form, rules, options) {
    var self = this;
    form.off('submit');
    this.$el = form;
    this.validators = {};
    this.results = [];

    options = options || {};
    options.klass = options.klass || 'error';
    if (typeof options.isKlassOnParent === 'undefined') {
      options.isKlassOnParent = false;
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
      validator.on('validated', validateCompleted);
      validator.errorKlasses = [];

      $el.on('focus', function() {
        var klasses = validator.errorKlasses.join(' ');
        var $parent = $el.data('parent') ?
              $el.closest($el.data('parent')) :
              $el.parent();
        validator.errorKlasses = [];

        if (self.options.isKlassOnParent) {
          $parent.removeClass(klasses);
        } else {
          $el.removeClass(klasses);
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

    function validateCompleted(result) {
      var $el = result.$el,
        errors = result.errors,
        klasses = this.errorKlasses.join(' ');
      var $parent = $el.data('parent') ?
            $el.closest($el.data('parent')) :
            $el.parent();
      this.errorKlasses = [];

      if (errors[0]) {
        this.errorKlasses.push(self.options.klass);
        this.errorKlasses.push(errors[0].klass);
        klasses = this.errorKlasses.join(' ');

        if (self.options.isKlassOnParent) {
          $parent.addClass(klasses);
        } else {
          $el.addClass(klasses);
        }
      } else {
        if (self.options.isKlassOnParent) {
          $parent.removeClass(klasses);
        } else {
          $el.removeClass(klasses);
        }
      }
    }
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

  return Form;
});
