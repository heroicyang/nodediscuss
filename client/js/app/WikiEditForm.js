ND.Module.define('WikiEditForm',
  ['Form', 'Validator', 'Editor'],
  function(Form, Validator, Editor) {
    return ND.Module.extend({
      initialize: function() {
        this.setupForm();
        this.listenTo(this.form, 'invalidated', this.onFormInvalidated);
        this.listenTo(this.form, 'validated', this.onFormValidated);
        this.editor = new Editor({
          el: '#content-editor'
        });
      },
      setupForm: function() {
        this.$form = this.$el;
        this.form = new Form(this.$form, {
          slug: [
            Validator.Required({ msg: 'Wiki 地址不能为空!' }),
            Validator.AlphaNumeric({ msg: 'Wiki 地址只能为字母、数字、下划线和横线。' })
          ],
          title: [
            Validator.Required({ msg: 'Wiki 标题不能为空!' }),
            Validator.Length({
              max: 100,
              msg: '标题字数不能超过 100 个。'
            })
          ],
          content: [
            Validator.Required({ msg: 'Wiki 内容不能为空!' })
          ]
        }, {
          isErrMsgOnHelpBlock: false
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