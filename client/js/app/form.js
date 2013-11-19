NC.Loader.define('Form', [], function() {
  function Form(form, options) {
    var self = this;
    form.off('submit');
    this.$el = form;
    this.validators = {};

    // 禁用 HTML5 的验证
    if (!this.$el.attr('novalidate')) {
      this.$el.attr('novalidate', 'true');
    }

    _.each(options, function(rules, field) {

    });

    form.submit(function() {
      self.validate();
      return false;
    });
  }

  _.extend(Form.prototype, Backbone.Events, {
    validate: function(callback) {}
  });
});