/**
 * test/mongoose_plugins/timestamp.test.js
 * 测试自定义的 mongoose 时间标记插件
 * @author heroic
 */

/**
 * Module dependencies
 */
var should = require('should');
var db = require('../../db');
var timestampPlugin = require('../../../models/mongoose_plugins/timestamp');

describe('models/mongoose_plugins/timestamp', function() {
  it('use timestamp plugin', function() {
    var PostSchema = new db.Schema({
      title: String,
      content: String
    });
    PostSchema.plugin(timestampPlugin());

    should.exist(PostSchema.path('createdAt'));
    should.exist(PostSchema.path('updatedAt'));
  });

  it('custom timestamp fields', function() {
    var PostSchema = new db.Schema({
      title: String,
      content: String
    });
    PostSchema.plugin(timestampPlugin({
      createdAtPath: 'created',
      updatedAtPath: 'updated'
    }));

    should.exist(PostSchema.path('created'));
    should.exist(PostSchema.path('updated'));
  });

  it('use virtual created field', function() {
    var PostSchema = new db.Schema({
      title: String,
      content: String
    });
    PostSchema.plugin(timestampPlugin({
      useVirtual: true
    }));
    var Post = db.model('Post', PostSchema);

    should.exist(PostSchema.virtualpath('createdAt'));
    should.exist(PostSchema.virtualpath('createdAt').applyGetters('', new Post()));
  });
});