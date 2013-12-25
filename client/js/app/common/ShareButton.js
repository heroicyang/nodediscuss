/**
 * 分享按钮
 * 相应类型的分享按钮应实现 `getWindowUrl` 方法
 * @author heroic
 */
ND.Module.define('ShareButton', [], function() {
  return ND.Module.extend({
    events: {
      'click': 'onShareButtonClick'
    },
    onShareButtonClick: function(e) {
      e.preventDefault();
      var url = this.getWindowUrl(),
        options = this.getWindowOptions();
      window.open(url, null, options);
    },
    getWindowUrl: ND.NOOP,
    getWindowOptions: function() {
      var width = 550,
        height = 420,
        swidth = window.screen.width,
        sheight = window.screen.height,
        left = Math.round((swidth - width) / 2),
        top = sheight > height ? Math.round((sheight - height) / 2) : 0;
      return 'scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=' +
        width + ',height=' + height + ',left=' + left + ',top=' + top;
    }
  });
});