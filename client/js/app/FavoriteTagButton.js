NC.Module.define('FavoriteTagButton', [], function() {
  return NC.Module.extend({
    events: {
      'click': 'onFavoriteTagClick'
    },
    onFavoriteTagClick: function(e) {
      e.preventDefault();
      var self = this,
        url;
      if (this.data.isFavorited) {
        url = '/tag/' + this.data.id + '/del_favorite';
      } else {
        url = '/tag/' + this.data.id + '/favorite';
      }

      $.post(url, { name: this.data.name })
        .done(function(data) {
          if (data.success) {
            if (self.data.isFavorited) {
              self.$el.attr('title', '收藏' + self.data.name + '节点');
              self.$el.text('收藏该节点');
            } else {
              self.$el.attr('title', '取消收藏' + self.data.name + '节点');
              self.$el.text('取消收藏');
            }

            self.data.isFavorited = !self.data.isFavorited;
          }
        });
    }
  });
});