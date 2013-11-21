/**
 * 按钮类基础模块，只具备点击事件触发，显示和隐藏等待状态的功能
 * @author heroic
 */
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