/**
 * 编辑器模块
 * @author heroic
 */
ND.Module.define('Editor', ['Marked'], function(Marked) {
  return ND.Module.extend({
    events: {
      'click .preview-button': 'onPreviewButtonClick',
      'click #et-insert-code .lang': 'onCodeLangClick'
    },
    /**
     * 在 markdown 渲染内容之前调用，可以对内容进行自定义处理
     * @param  {String} val  编辑器内容
     * @return {String}  内容
     */
    beforeRender: function(val) {
      return val;
    },
    /** 
     * 重写 Backbone.View 生成 $el 的方法，把界面上本身该是 $el 的元素给替换掉
     * 换成经过包装了标签页以及底部工具栏的元素
     */
    _ensureElement: function() {
      var el = $('#editor-wrap-tmpl').html(),
        $el = $(el),
        $textarea = $(_.result(this, 'el')),
        $prevEl = $textarea.prev(),
        $parent = $textarea.parent();

      $textarea = $textarea.detach();

      $el.find('#write').prepend($textarea);
      if ($prevEl.length) {
        $prevEl.after($el);
      } else {
        $parent.prepend($el);
      }
      $textarea = null;

      this.setElement($el, false);
    },
    initialize: function(options) {
      if (options.beforeRender) {
        this.beforeRender = options.beforeRender;
      }
      
      _.bindAll(this);
      this.$textarea = this.$('textarea');
      this.setupFileupload();
    },
    setupFileupload: function() {
      this.$('#et-upload-pic')
        .fileupload({
          url: '/upload/image',
          dataType: 'json',
          fileInput: $('#fileupload'),
          singleFileUploads: false
        })
        .bind('fileuploadsend', this.beforeImageUpload)
        .bind('fileuploaddone', this.onImageUploaded)
        .bind('fileuploadfail', this.onImageUploadError)
        .bind('fileuploadalways', this.onImageUploadEnd);
    },
    onPreviewButtonClick: function(e) {
      e.preventDefault();
      var val = this.$textarea.val();
      if ($(e.target).attr('href') === '#preview') {
        val = this.beforeRender(val);

        var html = Marked.render(val);
        $('#preview .content').html(html);
        $('#write').hide();
        $('#preview').show();
      } else {
        $('#preview').hide();
        $('#write').show();
      }
    },
    /** 生成一段预设的代码模板 */
    onCodeLangClick: function(e) {
      e.preventDefault();

      var lang = $(e.currentTarget).data('lang'),
        codeWrap = '```' + lang + '\n\n' + '```',
        cursorMove = lang.length + 4;  // 4: 开头的 ``` 长度 + 第一行结束的换行符

      this._replaceSelection(codeWrap, cursorMove);
    },
    beforeImageUpload: function() {
      this.$('#et-upload-pic').hide();
      this.$('.uploading').show();
      this.$('.toolbar .error').hide();
    },
    onImageUploaded: function(e, res) {
      var data = res.result,
        failedImgs = [],
        self = this;
      if (data.error) {
        this.onImageUploadError();
      } else {
        _.each(data, function(file) {
          if (file.error) {
            failedImgs.push(file.originalFilename);
            return;
          }
          var img = '![' + file.originalFilename + ']' +
              '(' + file.url + ')\n';
          self._replaceSelection(img, img.length);
        });

        if (failedImgs.length > 0) {
          var $failedImgs = this.$('.toolbar .error .failed-images');
          $failedImgs.tooltip({
            title: failedImgs.join('\n'),
            container: 'body'
          });
          $failedImgs.html('<strong>部分</strong>');
          this.$('.toolbar .error').show();
        }
      }
    },
    onImageUploadError: function() {
      this.$('.toolbar .error').show();
    },
    onImageUploadEnd: function() {
      this.$('#et-upload-pic').show();
      this.$('.uploading').hide();
    },
    /**
     * 对外暴露一个插入文本的方法
     * @param  {String} text
     */
    insert: function(text) {
      this._replaceSelection(text, text.length);
    },
    /**
     * 将内容插入（替换）到文本框中光标所选择的地方
     * @param  {String} text       需要插入的文本
     * @param  {Number} cursorMove 插入文本后光标需要向后移动的字符数
     */
    _replaceSelection: function(text, cursorMove) {
      var textarea = this.$textarea.get(0),
        val = textarea.value;
      text = text || '';
      cursorMove = cursorMove || 0;

      if (val) {
        text = '\n' + text;
        cursorMove += 1;
      }

      if (textarea.setSelectionRange) {
        var selectionStart = textarea.selectionStart,
          selectionEnd = textarea.selectionEnd;

        textarea.value = val.substr(0, selectionStart) +
            text + val.substr(selectionEnd, val.length);

        textarea.selectionStart = selectionStart + cursorMove;
      } else if (document.selection) {
        var range = document.selection.createRange();
        range.text = text;
        range.moveEnd('character', cursorMove);
        range.collapse(false);
      }

      textarea.focus();
    }
  });
});