ND.Module.define('FollowButton',
  ['ButtonBase'],
  function(ButtonBase) {
    return ButtonBase.extend({
      initialize: function() {
        this.on('button:click', this.onFollowButtonClick);
      },
      onFollowButtonClick: function() {
        this.showLoading();
        var self = this,
          url;
        if (this.data.followed) {
          url = '/user/' + this.data.username + '/unfollow';
        } else {
          url = '/user/' + this.data.username + '/follow';
        }

        $.post(url, { targetId: this.data.id })
          .done(function(res) {
            self.hideLoading();
            if (!res.error) {
              self.data.followed = !self.data.followed;
              if (self.data.followed) {
                self.$el.attr('data-loading-text', '取消关注...');
                self.$el.text('取消关注');
              } else {
                self.$el.attr('data-loading-text', '加入关注...');
                self.$el.text('加入关注');
              }
            }
          });
      }
    });
  });