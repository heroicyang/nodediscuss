NC.Loader.define('Validator', [], function() {
  function Validator(el, validators) {
    this.$el = el;
    this.validators = validators;
  }

  _.extend(Validator.prototype, Backbone.Events, {
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

  Validator.Required = function(options) {
    options = options || {};
    return function(el, callback) {
      var val = el.val(),
        errors = [],
        msg = options.msg || '该项不能为空',
        result;

      if (('checkbox' === el.attr('type') &&
            'checked' !== el.attr('checked')) || !val) {
        errors.push(msg);
      }

      result = {
        $el: el,
        errors: errors
      };
      callback && callback(result);
    };
  };

  return Validator;
});