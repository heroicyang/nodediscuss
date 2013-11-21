NC.Module.define('ButtonBase', [], function() {
  return NC.Module.extend({
    events: {
      'click': 'onButtonClick'
    },
    initialize: function() {
      this.$el.button();
    },
    onButtonClick: function() {
      this.trigger('buttonClick');
    },
    showLoading: function() {
      this.$el.button('loading');
    },
    hideLoading: function() {
      this.$el.button('reset');
    }
  });
});