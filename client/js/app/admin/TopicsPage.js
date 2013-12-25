ND.Module.define('TopicsPage', [], function() {
  return ND.Module.extend({
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
        $.post('/admin/topics/' + id + '/excellent', {
          _id: id,
          excellent: !excellent
        })
          .done(function(res) {
            if (!res.error) {
              window.location.reload();
            }
          });
      }
    },
    onRemoveClick: function(e) {
      if (window.confirm('确认要删除该话题？删除后不可恢复')) {
        var id = $(e.currentTarget).data('id');
        $.post('/admin/topics/' + id + '/remove', {
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