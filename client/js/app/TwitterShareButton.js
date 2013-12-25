/**
 * 分享到 Twitter 的按钮
 * @author heroic
 */
ND.Module.define('TwitterShareButton',
  ['ShareButton'],
  function(ShareButton) {
    return ShareButton.extend({
      getWindowUrl: function() {
        var url = 'https://twitter.com/intent/tweet?',
          params = {
            text: document.title,
            path: window.location.href
          };

        return url + $.param(params);
      }
    });
  });