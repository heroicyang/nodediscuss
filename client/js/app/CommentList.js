NC.Module.define('CommentList', [], function() {
  return NC.Module.extend({
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

      NC.pubsub.trigger('editor:insert', text);
      NC.pubsub.trigger('comment:reply', commentId);
    },
    onDeleteCommentClick: function(e) {
      e.preventDefault();
      var self = this;
      NC.loadModule({
        name: 'ConfirmDialog',
        content: '确认要删除该条评论？'
      }, function(confirmDialog) {
        self.listenTo(confirmDialog, 'confirmed', function() {
          var $el = $(e.currentTarget),
            id = $el.data('comment-id'),
            floor = $el.data('floor'),
            url = '/comment/' + id + '/del',
            $commentItem = $el.closest('li.list-group-item');
          $.post(url)
            .done(function(data) {
              if (data.success) {
                $commentItem.empty();
                $commentItem.html('<p class="deleted">该评论已被删除。<span>#' + floor + '楼</span></p>');
              }
            });
        });
      });
    }
  });
});