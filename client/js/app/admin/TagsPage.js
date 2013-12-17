NC.Module.define('TagsPage', [], function() {
  return NC.Module.extend({
    events: {
      'click .remove-btn': 'onRemoveClick'
    },
    onRemoveClick: function(e) {
      if (window.confirm('确认要删除该节点？删除后不可恢复')) {
        var id = $(e.currentTarget).data('id');
        $.post('/admin/tags/' + id + '/remove')
          .done(function(res) {
            if (res.success) {
              window.location.reload();
            }
          });
      }
    }
  });
});