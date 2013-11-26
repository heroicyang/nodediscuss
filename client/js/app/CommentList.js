NC.Module.define('CommentList', [], function() {
  return NC.Module.extend({
    events: {
      'click .reply-comment-btn': 'onReplyCommentClick',
      'click .del-comment-btn': 'onDeleteCommentClick'
    },
    onReplyCommentClick: function(e) {
      var $el = $(e.currentTarget),
        atUser = _.template('[@<%= nickname %>](/user/<%= username %>) ', {
          nickname: $el.data('nickname'),
          username: $el.data('username')
        }),
        floor = _.template('[#<%= floor %>楼](/topic/<%= topicId %>#comment-<%= floor %>) ', {
          floor: $el.data('floor'),
          topicId: this.data.id
        });

      NC.pubsub.trigger('editor:insert', atUser + floor);
    },
    onDeleteCommentClick: function(e) {
      e.preventDefault();
    }
  });
});