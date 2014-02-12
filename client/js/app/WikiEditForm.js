ND.Module.define('WikiEditForm',
  ['Form', 'Validator', 'Editor'],
  function(Form, Validator, Editor) {
    return ND.Module.extend({
      initialize: function() {
        this.setupForm();
        //this.listenTo(this.form, 'invalidated', this.onFormInvalidated);
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
      onFormInvalidated: function(data) {
        var errors = [],
          template = _.template($('#alert-danger-tmpl').html());

        _.each(data, function(item) {
          errors = errors.concat(item.errors);
        });

        this.$el.before(template({
          errors: errors
        }));
      },
      onFormValidated: function() {
        var submitButton = this.getChildById('submitButton');
        submitButton.showLoading();
        this.$form.off('submit');
        this.$form.submit();
      }
    });
  });