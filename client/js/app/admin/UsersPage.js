ND.Module.define('UsersPage', [], function() {
  return ND.Module.extend({
    events: {
      'click .verify-btn': 'onVerifyClick',
      'click .block-btn': 'onBlockClick'
    },
    onVerifyClick: function(e) {
      var $btn = $(e.currentTarget),
        verified = $btn.data('verified'),
        title= '确定要设置该用户为信任用户？';
      if (verified) {
        title = '确定要取消设置该信任用户？';
      }
      
      if (window.confirm(title)) {
        var id = $btn.data('id');
        $.post('/admin/users/' + id + '/verify', {
          _id: id,
          verified: !verified
        })
          .done(function(res) {
            if (!res.error) {
              window.location.reload();
            }
          });
      }
    },
    onBlockClick: function(e) {
      var $btn = $(e.currentTarget),
        locked = $btn.data('locked') === 2,
        title= '确定要锁定该用户？';
      if (locked) {
        title = '确定要解除锁定该用户？';
      }
      
      if (window.confirm(title)) {
        var id = $btn.data('id');
        $.post('/admin/users/' + id + '/block', {
          _id: id,
          state: locked ? '1' : '2'
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