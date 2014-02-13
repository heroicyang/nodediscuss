ND.Module.define('WikiEditForm',
  ['Form', 'Validator', 'Editor'],
  function(Form, Validator, Editor) {
    return ND.Module.extend({
      initialize: function() {
        this.setupForm();
        this.listenTo(this.form, 'validated', this.onFormValidated);
        this.editor = new Editor({
          el: '#content-editor'
        });
      },
      setupForm: function() {
        this.$form = this.$el;
        this.form = new Form(this.$form, {
          slug: [
            Validator.Required(),
            Validator.AlphaNumeric()
          ],
          title: [
            Validator.Required(),
            Validator.Length({
              max: 100
            })
          ],
          content: [
            Validator.Required()
          ]
        }, {
          isKlassOnParent: true
        });
      },
      onFormValidated: function() {
        var submitButton = this.getChildById('submitButton');
        submitButton.showLoading();
        this.$form.off('submit');
        this.$form.submit();
      }
    });
  });