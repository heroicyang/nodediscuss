ND.Module.define('CommentList', [], function() {
  return ND.Module.extend({
    events: {
      'click .reply-button': 'onReplyButtonClick',
      'click .del-button': 'onDeleteButtonClick'
    },
    onReplyButtonClick: function(e) {
      e.preventDefault();
      var $el = $(e.currentTarget),
        id = $el.data('id'),
        text = _.template('#<%= floor %>楼 @<%= username %> ', {
          floor: $el.data('floor'),
          username: $el.data('username')
        });

      ND.pubsub.trigger('editor:insert', text);
      ND.pubsub.trigger('comment:reply', id);
    },
    onDeleteButtonClick: function(e) {
      e.preventDefault();
      if (window.confirm('确认要删除该条评论？')) {
        var $el = $(e.currentTarget),
          id = $el.data('id'),
          floor = $el.data('floor'),
          url = '/comments/' + id + '/remove',
          $commentItem = $el.closest('li.item');
        $.post(url, { _id: id })
          .done(function(res) {
            if (!res.error) {
              var $deletedItem = $('<div>').addClass('content')
                                  .append('<del>#' + floor + '楼评论已被删除。</del>');
              $commentItem.html($deletedItem);
            }
          });
      }
    }
  });
});