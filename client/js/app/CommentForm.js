NC.Module.define('CommentForm',
  ['Form', 'Validator'],
  function(Form, Validator) {
    return NC.Module.extend({
      initialize: function() {
        this.setupForm();
        this.listenTo(this.form, 'validated', this.onFormValidated);
      },
      onBuildComplete: function() {
        this.editor = this.getChildById('contentEditor');
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
      insertTextToEditor: function(data) {
        this.editor.insert(data);
      }
    });
  });