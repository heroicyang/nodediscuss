/**
 * 分享到 Facebook 的按钮
 * @author heroic
 */
NC.Module.define('FacebookShareButton',
  ['ShareButton'],
  function(ShareButton) {
    return ShareButton.extend({
      getWindowUrl: function() {
        var url = 'https://www.facebook.com/sharer/sharer.php?',
          params = {
            u: window.location.href,
            t: document.title
          };

        return url + $.param(params);
      }
    });
  });