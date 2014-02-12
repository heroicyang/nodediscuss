/**
 * 注册表单模块
 * @author heroic
 */
ND.Module.define('SignupForm',
  ['Form', 'Validator'],
  function(Form, Validator) {
    return ND.Module.extend({
      initialize: function() {
        this.setupForm();
        this.listenTo(this.form, 'validated', this.onFormValidated);
      },
      setupForm: function() {
        this.$form = this.$el;
        this.form = new Form(this.$form, {
          email: [
            Validator.Required(),
            Validator.Email()
          ],
          username: [
            Validator.Required(),
            Validator.AlphaNumeric(),
            Validator.Length({
              min: 6,
              max: 16
            })
          ],
          password: [
            Validator.Required(),
            Validator.Length({
              min: 6,
              max: 31
            })
          ],
          repassword: [
            Validator.Required(),
            Validator.Length({
              min: 6,
              max: 31
            })
          ]
        }, {
          isKlassOnParent: true
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