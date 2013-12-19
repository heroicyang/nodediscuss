/**
 * 使用 `marked` 库解析 markdown 文本
 * 自定义了代码块和超链接的解析逻辑
 * TODO: 还应该自定义图片的解析，防止使用图片进行跨站攻击
 * @author heroic
 */

/**
 * Module dependencies
 */
var marked = require('marked'),
  hljs = require('highlight.js');

// 使用 `highlight.js` 库来解析代码块
var r = new marked.Renderer();
r.code = function(code, lang) {
  if (lang) {
    return hljs.highlight(lang, code).value;
  } else {
    return hljs.highlightAuto(code).value;
  }
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

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  renderer: r
});

/**
 * Expose marked
 */
module.exports = exports = marked;