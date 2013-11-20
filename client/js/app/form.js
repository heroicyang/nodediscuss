NC.Loader.define('Form', ['Validator'], function(Validator) {
  function Form(form, options) {
    var self = this;
    form.off('submit');
    this.$el = form;
    this.validators = {};
    this.errors = [];

    // 禁用 HTML5 的验证
    if (!this.$el.attr('novalidate')) {
      this.$el.attr('novalidate', 'true');
    }

    _.each(options, function(validators, el) {
      var $el = form.find('[name="' + el + '"]'),
        validator = new Validator($el, validators);
      self.validators[el] = validator;
      validator.on('validated', validateCompleted);
    });

    form.submit(function() {
      self.validate(function() {
        if (self.hasErrors()) {
          return ;
        }
        self.trigger('validated');
      });
      return false;
    });
  }

  _.extend(Form.prototype, Backbone.Events, {
    validate: function(callback) {
      var validatorCount = this.validators.length,
        self = this;

      _.each(this.validators, function(validator) {
        validator.validate(function(result) {
          validatorCount -= 1;
          self.errors.push(result);

          if (validatorCount === 0) {
            callback && callback();
          }
        });
      });
    },
    hasErrors: function() {
      return this.errors.length > 0;
    }
  });

  function validateCompleted(result) {
    var $el = result.$el,
      errors = result.errors,
      $controlGroupEl = $el.closest('.form-group');
    if (errors[0]) {
      $controlGroupEl.addClass('has-error');
    } else {
      $controlGroupEl.removeClass('has-error');
    }
  }

  return Form;
});