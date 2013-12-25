ND.Module.define('LogoutButton', [], function() {
  return ND.Module.extend({
    events: {
      'click': 'onLogoutButtonClick'
    },
    onLogoutButtonClick: function(e) {
      e.preventDefault();
      $.post('/logout')
        .done(function(data) {
          if (data.success) {
            window.location.href = '/';
          }
        });
    }
  });
});