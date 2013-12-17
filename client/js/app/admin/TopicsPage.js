NC.Module.define('TopicsPage', [], function() {
  return NC.Module.extend({
    events: {
      'click .excellent-btn': 'onExcellentClick',
      'click .remove-btn': 'onRemoveClick'
    },
    onExcellentClick: function(e) {
      var $btn = $(e.currentTarget),
        excellent = $btn.data('excellent'),
        title= '确定要将该话题设置为优质话题？';
      if (excellent) {
        title = '确定要取消设置该优质话题？';
      }
      
      if (window.confirm(title)) {
        var id = $btn.data('id');
        $.post('/admin/topics/' + id + '/excellent')
          .done(function(res) {
            if (res.success) {
              window.location.reload();
            }
          });
      }
    },
    onRemoveClick: function(e) {
      if (window.confirm('确认要删除该话题？删除后不可恢复')) {
        var id = $(e.currentTarget).data('id');
        $.post('/admin/topics/' + id + '/remove')
          .done(function(res) {
            if (res.success) {
              window.location.reload();
            }
          });
      }
    }
  });
});