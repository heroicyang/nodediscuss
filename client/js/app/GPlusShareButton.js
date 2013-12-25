/**
 * 分享到 Google+ 的按钮
 * @author heroic
 */
ND.Module.define('GPlusShareButton',
  ['ShareButton'],
  function(ShareButton) {
    return ShareButton.extend({
      getWindowUrl: function() {
        var url = 'https://plus.google.com/share?',
          params = {
            url: window.location.href
          };

        return url + $.param(params);
      }
    });
  });