/**
 * 登录表单模块
 * @author heroic
 */
ND.Module.define('SigninForm',
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
          password: [
            Validator.Required()
          ]
        }, {
          isKlassOnParent: true
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