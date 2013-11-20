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
            Validator.Required({ msg: 'Email 不能为空' }),
            Validator.Email({ msg: 'Email 格式不正确，请检查后重新填写' })
          ],
          username: [
            Validator.Required({ msg: '用户名不能为空' }),
            Validator.AlphaNumeric({ msg: '用户名只能使用字母 a-z 或数字 0-9' }),
            Validator.Length({
              min: 6,
              max: 16,
              msg: '请使用长度为 %s-%s 的字母或数字'
            })
          ],
          password: [
            Validator.Required({ msg: '密码不能为空' }),
            Validator.Length({
              min: 6,
              max: 31,
              msg: '密码长度必须为 %s-%s，请检查'
            })
          ],
          repassword: [
            Validator.Required({ msg: '请再次输入你的密码' }),
            Validator.Length({
              min: 6,
              max: 31,
              msg: '密码长度必须为 %s-%s，请检查'
            })
          ]
        });
      },
      onFormValidated: function() {
        this.$form.off('submit');
        this.$form.submit();
      }
    });
  });