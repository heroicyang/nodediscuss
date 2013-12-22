/**
 * 初始化 `marked` 的配置，并将其导出为公用模块
 * @author heroic
 */
NC.Loader.define('Marked', [], function() {
  var options = {
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
  };

  if (marked.Renderer) {
    // 新版 API，已在 GitHub 的 master 分支更新，但未发布到 npm
    var r = new marked.Renderer();

    // 使用 `highlight.js` 库来解析代码块
    r.code = function(code, lang) {
      var out = '<pre>';
      if (lang) {
        out += '<code class="lang-' + lang + '">' +
            hljs.highlight(lang, code).value;
      } else {
        out += '<code>' +
            hljs.highlightAuto(code).value;
      }
      out += '\n</code></pre>';
      return out;
    };

    // 对外部链接加上 `target="_blank"` 的特性
    r.link = function(href, title, text) {
      var out = '<a href="' + href + '"';
      if (title) {
        out += ' title="' + title + '"';
      }
      if (/(https?|s?ftp|git)/i.test(href)) {
        out += ' target="_blank"';
      }
      out += '>' + text + '</a>';
      return out;
    };

    options.renderer = r;
  } else {      // fallback
    // 使用 `highlight.js` 库来解析代码块
    options.highlight = function(code, lang) {
      if (lang) {
        return hljs.highlight(lang, code).value;
      } else {
        return hljs.highlightAuto(code).value;
      }
    };
  }

  marked.setOptions(options);
  return {
    render: function(val) {
      return marked(val);
    }
  };
});