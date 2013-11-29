/**
 * 为每个 schema 增加带分页功能的查询方法
 * @author heroic
 */

module.exports = exports = function() {
  function Paginate(model, conditions) {
    conditions = conditions || {};
    this.model = model;
    this.conditions = conditions;
    this.query = model.find(conditions).lean();
  }

  Paginate.prototype.paginate = function(pageIndex, pageSize) {
    pageIndex = pageIndex || 1;
    pageSize = pageSize || 20;
    this.query = this.query.skip((pageIndex - 1) * pageSize).limit(pageSize);
    return this;
  };

  Paginate.prototype.exec = function(callback) {
    var self = this;
    this.model.count(this.conditions, function(err, count) {
      if (err) {
        return callback(err);
      }
      self.query.exec(function(err, docs) {
        callback(err, count, docs);
      });
    });
  };

  Paginate.prototype.execQuery = function(callback) {
    this.query.exec(callback);
  };

  return function(schema) {
    schema.statics.query = function(conditions) {
      return new Paginate(this, conditions);
    };
  };
};