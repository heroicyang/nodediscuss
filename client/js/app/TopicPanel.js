ND.Module.define('TopicPanel', [], function() {
  return ND.Module.extend({
    events: {
      'click .favorite-btn': 'onFavoriteClick'
    },
    onFavoriteClick: function(e) {
      e.preventDefault();
      var requestURL = '/topic/' + this.data.id + '/favorite',
        self = this;

      if (this.data.isFavorited) {
        requestURL = '/topic/' + this.data.id + '/unfavorite';
      }

      $.post(requestURL)
        .done(function(data) {
          if (data.success) {
            self.data.isFavorited = !self.data.isFavorited;
            if (self.data.isFavorited) {
              self.$('.favorite-btn').attr('title', '取消收藏该话题');
              self.$('.favorite-btn i').removeClass('fa-bookmark-o');
              self.$('.favorite-btn i').addClass('fa-bookmark');
            } else {
              self.$('.favorite-btn').attr('title', '收藏该话题');
              self.$('.favorite-btn i').removeClass('fa-bookmark');
              self.$('.favorite-btn i').addClass('fa-bookmark-o');
            }
          }
        });
    }
  });
});