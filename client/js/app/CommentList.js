ND.Module.define('CommentList', [], function() {
  return ND.Module.extend({
    events: {
      'click .reply-comment-btn': 'onReplyCommentClick',
      'click .del-comment-btn': 'onDeleteCommentClick'
    },
    onReplyCommentClick: function(e) {
      var $el = $(e.currentTarget),
        commentId = $el.data('comment-id'),
        text = _.template('#<%= floor %>楼 @<%= username %> ', {
          floor: $el.data('floor'),
          username: $el.data('username')
        });

      ND.pubsub.trigger('editor:insert', text);
      ND.pubsub.trigger('comment:reply', commentId);
    },
    onDeleteCommentClick: function(e) {
      e.preventDefault();
      var self = this;
      ND.loadModule({
        name: 'ConfirmDialog',
        content: '确认要删除该条评论？'
      }, function(confirmDialog) {
        self.listenTo(confirmDialog, 'confirmed', function() {
          var $el = $(e.currentTarget),
            id = $el.data('comment-id'),
            floor = $el.data('floor'),
            url = '/comments/' + id + '/remove',
            $commentItem = $el.closest('li.list-group-item');
          $.post(url, { _id: id })
            .done(function(res) {
              if (!res.error) {
                $commentItem.empty();
                $commentItem.html('<p class="deleted"><del>#' + floor + '楼评论已被删除。</del></p>');
              }
            });
        });
      });
    }
  });
});