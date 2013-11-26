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
    }
  });
});