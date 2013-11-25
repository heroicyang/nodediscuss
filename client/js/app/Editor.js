/**
 * 编辑器模块
 * @author heroic
 */
NC.Module.define('Editor', [], function() {
  marked.setOptions({
    gfm: true,
    highlight: function(code, lang) {
      if (lang) {
        return hljs.highlight(lang, code).value;
      } else {
        return hljs.highlightAuto(code).value;
      }
    },
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    langPrefix: 'lang-'
  });

  return NC.Module.extend({
    events: {
      'show.bs.tab .nav-tabs a[data-toggle="tab"]': 'onTabShow',
      'click #et-insert-code .lang': 'onCodeInsertClick'
    },
    /** 
     * 重写 Backbone.View 生成 $el 的方法，把界面上本身该是 $el 的元素给替换掉
     * 换成经过包装了标签页以及底部工具栏的元素
     */
    _ensureElement: function() {
      var el = $('#editor-wrap').html(),
        $el = $(el),
        $textarea = $(_.result(this, 'el')),
        $textareaClone = $textarea.clone(true).attr('data-widearea', 'enable');

      $textarea.replaceWith($el);
      $el.find('#write').prepend($textareaClone);

      this.setElement($el, false);
    },
    /** 初始化的时候设置所谓的禅模式编辑器 */
    initialize: function() {
      // TODO: 这玩意有个 BUG，数据存在 localStorage 里，
      // 导致页面上的 textarea 数据不能清除
      // 待主体功能完成了，重写下他这个插件好了
      this.wideArea = wideArea().setOptions({
        closeIconLabel: '退出禅模式',
        changeThemeIconLabel: '切换主题',
        fullScreenIconLabel: '禅模式'  // 也是 BUG，根本设置不了
      });
      this.$textarea = this.$('textarea');

      _.bindAll(this);
      this.setupFileupload();
    },
    setupFileupload: function() {
      this.$('#et-upload-pic').fileupload({
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
    /** 格式化文本框中的 markdown 文本 */
    onTabShow: function(e) {
      if ($(e.target).attr('href') === '#preview') {
        $('#preview').html(marked(this.$textarea.val()));
      }
    },
    /** 生成一段预设的代码模板 */
    onCodeInsertClick: function(e) {
      e.preventDefault();
      var lang = $(e.currentTarget).data('lang'),
        codeWrap = '\n```' + lang + '\n\n' + '```\n',
        cursorMove = lang.length + 5;  // 5: 第一行起始和结束的换行符，以及 ``` 的长度

      this._replaceSelection(codeWrap, cursorMove);
    },
    beforeImageUpload: function() {
      this.$('#et-upload-pic').hide();
      this.$('.uploading').show();
      this.$('.toolbar .error').hide();
    },
    onImageUploaded: function(e, data) {
      var res = data.result,
        failedImgs = [],
        self = this;
      if (res.success) {
        _.each(res.files, function(file) {
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
      } else {
        this.onImageUploadError();
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