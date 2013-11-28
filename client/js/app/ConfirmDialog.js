NC.Module.define('ConfirmDialog', [], function() {
  return NC.Module.extend({
    el: $('#confirm-dialog-tmpl').html(),
    events: {
      'click #confirm-btn': 'onConfirmClick'
    },
    initialize: function(options) {
      var title = options.title || '确认操作？',
        content = options.content || '确认要执行该操作？';
      this.$('.modal-title').text(title);
      this.$('.modal-body p').text(content);
      this.$el.modal();
      this.$el.on('shown.bs.modal', function() {
        $('body').addClass('modal-open');
      }).on('hidden.bs.modal', function() {
        $('body').removeClass('modal-open');
      });
    },
    onConfirmClick: function() {
      this.trigger('confirmed');
      this.$el.modal('hide');
    }
  });
});