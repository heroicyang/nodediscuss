/**
 * 编辑器模块
 * @author heroic
 */
NC.Module.define('Editor', [], function() {
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
      wideArea().setOptions({
        closeIconLabel: '退出禅模式',
        changeThemeIconLabel: '切换主题',
        fullScreenIconLabel: '禅模式'
      });
    },
    onTabShow: function(e) {
      
    },
    onUploadPicClick: function(e) {

    },
    onCodeInsertClick: function(e) {

    },
    onModeSwitchClick: function(e) {

    }
  });
});