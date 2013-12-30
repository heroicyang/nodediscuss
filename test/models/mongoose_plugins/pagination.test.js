/**
 * test/models/mongoose_plugins/pagination.test.js
 * 对自定义的 mongoose 分页插件进行测试
 * @author heroic
 */

/**
* Module dependencies
*/
var should = require('should');
var db = require('../../db');
var paginationPlugin = require('../../../models/mongoose_plugins/pagination');

describe('models/mongoose_plugins/pagination', function() {
  var PostSchema = new db.Schema({
    title: String,
    content: String
  });
  PostSchema.plugin(paginationPlugin());
  var Post = db.model('Post', PostSchema);

  after(function() {
    db.models.Post = null;
  });

  it('pagination pluged', function() {
    should.exist(PostSchema.statics.paginate);
    PostSchema.statics.paginate.should.have.length(3);
    should.exist(Post.paginate);
  });

  it('paginate without conditions and options', function(done) {
    Post.paginate(function(err, count, docs) {
      if (err) {
        throw err;
      }
      count.should.eql(0);
      docs.should.have.length(0);
      done();
    });
  });

  it('paginate without options', function(done) {
    Post.paginate({
      title: 'test'
    }, function(err, count, docs) {
      if (err) {
        throw err;
      }
      count.should.be.an.Number;
      count.should.eql(0);
      docs.should.be.an.Array;
      docs.should.have.length(0);
      done();
    });
  });

  it('with notPaged options', function(done) {
    Post.paginate({
      title: 'test'
    }, {
      notPaged: true
    }, function(err, count, docs) {
      if (err) {
        throw err;
      }
      count.should.be.an.Array;
      count.should.have.length(0);
      should.not.exist(docs);
      done();
    });
  });
});