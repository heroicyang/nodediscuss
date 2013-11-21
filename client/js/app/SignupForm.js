NC.Module.define('SignupForm',
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
            Validator.Required({ msg: '电子邮件地址必填!' }),
            Validator.Email({ msg: '不像是有效的电子邮件地址。' })
          ],
          username: [
            Validator.Required({ msg: '用户名必填!' }),
            Validator.AlphaNumeric({ msg: '用户名无效! 仅支持字母与数字。' }),
            Validator.Length({
              min: 6,
              max: 16,
              msg: '用户名长度为 %s - %s。'
            })
          ],
          password: [
            Validator.Required({ msg: '密码不能为空。' }),
            Validator.Length({
              min: 6,
              max: 31,
              msg: '密码长度为 %s - %s。'
            })
          ],
          repassword: [
            Validator.Required({ msg: '请再次输入你的密码。' }),
            Validator.Length({
              min: 6,
              max: 31,
              msg: '密码长度为 %s - %s。'
            })
          ]
        });
      },
      onFormValidated: function() {
        var signupButton = this.getChildById('signupButton');
        signupButton.showLoading();
        this.$form.off('submit');
        this.$form.submit();
      }
    });
  });