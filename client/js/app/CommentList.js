NC.Module.define('CommentList', [], function() {
  return NC.Module.extend({
    events: {
      'click .reply-comment-btn': 'onReplyCommentClick',
      'click .del-comment-btn': 'onDeleteCommentClick'
    },
    onReplyCommentClick: function(e) {
      var $el = $(e.currentTarget),
        text = _.template('#<%= floor %>楼 @<%= username %> ', {
          floor: $el.data('floor'),
          username: $el.data('username')
        });

      NC.pubsub.trigger('editor:insert', text);
    },
    onDeleteCommentClick: function(e) {
      e.preventDefault();
    }
  });
});