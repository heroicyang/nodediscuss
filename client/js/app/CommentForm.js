NC.Module.define('CommentForm',
  ['Form', 'Validator'],
  function(Form, Validator) {
    return NC.Module.extend({
      initialize: function() {
        this.setupForm();
        this.listenTo(this.form, 'validated', this.onFormValidated);
        _.bindAll(this);
      },
      onBuildComplete: function() {
        this.editor = this.getChildById('contentEditor');
        this.editor.processValue = this.parseFloorAndAt;
        this.listenTo(NC.pubsub, 'editor:insert', this.insertTextToEditor);
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
        var commentButton = this.getChildById('commentButton');
        commentButton.showLoading();
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
      }
    });
  });