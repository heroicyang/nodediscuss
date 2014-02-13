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

    _.each(rules, function(validators, item) {
      var $item = form.find('[name="' + item + '"]'),
        validator = new Validator($item, validators);
      self.validators[item] = validator;
      validator.on('validated', validateCompleted);
      
      $item.data('errorKlasses', []);
      $item.on('focus', function() {
        var klasses = $item.data('errorKlasses').join(' ');
        var $parent = $item.data('parent') ?
              $item.closest($item.data('parent')) :
              $item.parent();
        $item.data('errorKlasses', []);

        if (self.options.isKlassOnParent) {
          $parent.removeClass(klasses);
        } else {
          $item.removeClass(klasses);
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
      var $item = result.$el,
        errors = result.errors,
        klasses;
      var $parent = $item.data('parent') ?
            $item.closest($item.data('parent')) :
            $item.parent();

      if (errors[0]) {
        $item.data('errorKlasses', ($item.data('errorKlasses') || []).concat([
          self.options.klass,
          errors[0].klass
        ]));
        klasses = $item.data('errorKlasses').join(' ');

        if (self.options.isKlassOnParent) {
          $parent.addClass(klasses);
        } else {
          $item.addClass(klasses);
        }
      } else {
        klasses = $item.data('errorKlasses').join(' ');
        $item.data('errorKlasses', []);

        if (self.options.isKlassOnParent) {
          $parent.removeClass(klasses);
        } else {
          $item.removeClass(klasses);
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
