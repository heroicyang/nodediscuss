NC.Module.define('PagesPage', [], function() {
  return NC.Module.extend({
    events: {
      'click .remove-btn': 'onRemoveClick'
    },
    onRemoveClick: function(e) {
      if (window.confirm('确认要删除该页面？删除后不可恢复')) {
        var id = $(e.currentTarget).data('id');
        $.post('/admin/pages/' + id + '/remove', {
          _id: id
        })
          .done(function(res) {
            if (!res.error) {
              window.location.reload();
            }
          });
      }
    }
  });
});