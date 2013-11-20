/**
 * 具备验证功能的表单模块
 * @author heroic
 */

NC.Loader.define('Form', ['Validator'], function(Validator) {
  function Form(form, rules, options) {
    var self = this;
    form.off('submit');
    this.$el = form;
    this.validators = {};
    this.results = [];

    // 禁用 HTML5 的验证
    if (!this.$el.attr('novalidate')) {
      this.$el.attr('novalidate', 'true');
    }

    _.each(rules, function(validators, el) {
      var $el = form.find('[name="' + el + '"]'),
        validator = new Validator($el, validators);
      self.validators[el] = validator;
      validator.on('validated', validateCompleted);

      $el.on('focus', function() {
        $el.next('.help-block.error').remove();
        $el.closest('.form-group').removeClass('has-error');
        $el.next('.help-block').show();
      });
    });

    form.submit(function() {
      self.results = [];
      self.validate(function() {
        if (self.hasErrors()) {
          return;
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
      errors = result.errors,
      $controlGroupEl = $el.closest('.form-group');

    $el.next('.help-block.error').remove();
    if (errors[0]) {
      $el.next('.help-block').hide();
      $el.after('<span class="help-block error">' + errors[0] + '</span>');
      $controlGroupEl.addClass('has-error');
    } else {
      $el.next('.help-block').show();
      $controlGroupEl.removeClass('has-error');
    }
  }

  return Form;
});
