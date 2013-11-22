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
      'click #et-upload-pic': 'onUploadPicClick',
      'click #et-insert-code .lang': 'onCodeInsertClick'
    },
    _ensureElement: function() {
      var el = $('#editor-wrap').html(),
        $el = $(el),
        $textarea = $(_.result(this, 'el')),
        $textareaClone = $textarea.clone(true).attr('data-widearea', 'enable');

      $textarea.replaceWith($el);
      $el.find('#write').prepend($textareaClone);

      this.setElement($el, false);
    },
    initialize: function() {
      //TODO: 这玩意有个 BUG，数据是存在 localStorage 里的，所以多个页面上的 textarea 数据不能清除
      // 待主体功能完成了，重写下他这个插件好了
      this.wideArea = wideArea().setOptions({
        closeIconLabel: '退出禅模式',
        changeThemeIconLabel: '切换主题',
        fullScreenIconLabel: '禅模式'  // 也是 BUG，根本设置不了
      });
      this.$textarea = this.$('textarea');
    },
    onTabShow: function(e) {
      if ($(e.target).attr('href') === '#preview') {
        $('#preview').html(marked(this.$textarea.val()));
      }
    },
    onUploadPicClick: function(e) {

    },
    onCodeInsertClick: function(e) {

    },
    onModeSwitchClick: function(e) {

    }
  });
});