/**
 * 登录表单模块
 * @author heroic
 */
NC.Module.define('SigninForm',
  ['Form', 'Validator'],
  function(Form, Validator) {
    return NC.Module.extend({
      initialize: function() {
        this.setupForm();
        this.listenTo(this.form, 'validated', this.onFormValidated);
      },
      setupForm: function() {
        this.$form = this.$el;
        this.form = new Form(this.$form, {
          email: [
            Validator.Required({ msg: '电子邮件地址不能为空。' }),
            Validator.Email({ msg: '不像是有效的电子邮件地址。' })
          ],
          password: [
            Validator.Required({ msg: '密码不能为空。' })
          ]
        }, {
          errClassEl: '.form-group'
        });
      },
      onFormValidated: function() {
        var signinButton = this.getChildById('signinButton');
        signinButton.showLoading();
        this.$form.off('submit');
        this.$form.submit();
      }
    });
  });