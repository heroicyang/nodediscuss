NC.Module.define('CommentForm',
  ['Form', 'Validator'],
  function(Form, Validator) {
    return NC.Module.extend({
      onBuildComplete: function() {
        this.setupForm();
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
      }
    });
  });