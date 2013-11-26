NC.Module.define('CommentForm',
  ['Form', 'Validator'],
  function(Form, Validator) {
    return NC.Module.extend({
      initialize: function() {
        this.setupForm();
        this.listenTo(this.form, 'validated', this.onFormValidated);
        _.bindAll(this);
        this.commentIds = [];
      },
      onBuildComplete: function() {
        this.editor = this.getChildById('contentEditor');
        this.editor.processValue = this.parseFloorAndAt;
        this.listenTo(NC.pubsub, 'editor:insert', this.insertTextToEditor);
        this.listenTo(NC.pubsub, 'comment:reply', this.replyComment);
      },
      setupForm: function() {
        this.$form = this.$el;
        this.form = new Form(this.$form, {
          content: [
            Validator.Required({ msg: '评论内容不能为空!' })
          ]
        }, {
          isErrMsgOnHelpBlock: false
        });
      },
      onFormValidated: function() {
        var commentButton = this.getChildById('commentButton'),
          $commentIdInput;
        commentButton.showLoading();

        _.each(this.commentIds, function(commentId) {
          $commentIdInput = $('<input>').attr('type', 'hidden')
              .attr('name', 'commentIds[]')
              .attr('value', commentId);
          this.$('input[name="topicId"]').after($commentIdInput);
        }, this);

        this.$form.off('submit');
        this.$form.submit();
      },
      parseFloorAndAt: function(data) {
        var self = this;
        data = data.replace(/#(\d+)楼/g, function(group, p1) {
          return _.template('[#<%= floor %>楼](/topic/<%= topicId %>#comment-<%= floor %>) ', {
            floor: p1,
            topicId: self.data.id
          });
        }).replace(/@([a-zA-Z0-9\-_]+)/g, function(group, p1) {
          return _.template('[@<%= username %>](/user/<%= username %>) ', {
            username: p1
          });
        });
        return data;
      },
      insertTextToEditor: function(data) {
        this.editor.insert(data);
      },
      replyComment: function(commentId) {
        this.commentIds.push(commentId);
      }
    });
  });