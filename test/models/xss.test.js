/**
 * Module dependencies
 */
var xss = require('../../models/xss');

describe('models/xss.js', function() {
  it('values should filter xss', function() {
    var doc = {
      title: '<a href="javascript:alert(1);">click me</a>',
      contentHtml: '<a href="javascript:alert(1);">click me</a>' +
          '<pre><code class="javascript">alert("1");</code></pre>',
      tag: ''
    };
    xss(doc, 'title');
    xss(doc, ['contentHtml', 'tag']);
    doc.title.indexOf('javascript').should.eql(-1);
    doc.contentHtml.indexOf('class').should.be.above(0);
    doc.contentHtml.indexOf('alert').should.be.above(0);
  });
});