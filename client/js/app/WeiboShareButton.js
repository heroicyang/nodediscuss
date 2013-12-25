/**
 * 分享到新浪微博的按钮
 * @author heroic
 */
ND.Module.define('WeiboShareButton',
  ['ShareButton'],
  function(ShareButton) {
    return ShareButton.extend({
      getWindowUrl: function() {
        var url = 'http://service.weibo.com/share/share.php?',
          params = {
            appkey: this.options.appkey,
            title: document.title,
            url: window.location.href,
            content: 'utf-8'
          };

        return url + $.param(params);
      }
    });
  });