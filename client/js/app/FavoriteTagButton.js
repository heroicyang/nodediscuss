ND.Module.define('FavoriteTagButton', [], function() {
  return ND.Module.extend({
    events: {
      'click': 'onFavoriteTagClick'
    },
    onFavoriteTagClick: function(e) {
      e.preventDefault();
      var self = this,
        url;
      if (this.data.isFavorited) {
        url = '/tag/' + this.data.slug + '/unfavorite';
      } else {
        url = '/tag/' + this.data.slug + '/favorite';
      }

      $.post(url, {
        slug: this.data.slug
      })
        .done(function(res) {
          if (!res.error) {
            self.data.isFavorited = !self.data.isFavorited;
            if (self.data.isFavorited) {
              self.$el.attr('title', '取消收藏' + self.data.name + '节点');
              self.$el.text('取消收藏');
            } else {
              self.$el.attr('title', '收藏' + self.data.name + '节点');
              self.$el.text('收藏该节点');
            }
          }
        });
    }
  });
});