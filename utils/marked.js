/**
 * 处理 Markdown 及代码高亮
 * @author heroic
 */

/**
 * Module dependencies
 */
var marked = require('marked'),
  hljs = require('highlight.js');

// 全局设置
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

/**
 * Module exports
 */
module.exports = exports = marked;