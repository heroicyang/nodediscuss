NC.Module.define('SignupForm',
  ['Form', 'Validator'],
  function(Form, Validator) {
    return NC.Module.extend({
      initialize: function() {
        this.setupForm();
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
        });
      }
    });
  });