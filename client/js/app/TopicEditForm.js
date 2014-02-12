ND.Module.define('TopicEditForm',
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
          'tag[id]': [
            Validator.Required()
          ],
          title: [
            Validator.Required(),
            Validator.Length({
              min: 10,
              max: 100
            })
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

        this.$('legend').after(template({
          errors: errors
        }));
      },
      onFormValidated: function() {
        var submitTopicButton = this.getChildById('submitTopicButton');
        submitTopicButton.showLoading();
        this.$form.off('submit');
        this.$form.submit();
      }
    });
  });