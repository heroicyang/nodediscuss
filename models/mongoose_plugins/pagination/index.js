/**
 * Mongoose 分页插件
 * @author heroic
 */

/**
 * Expose plugin
 * @param  {Object} options
 *  - defaultSort    {Object|String}  默认的排序规则
 * @return {Function}
 */
module.exports = exports = function(options) {
  var defaultSort = options.defaultSort;

  /**
   * 分页操作类构造函数
   * @param {Mongoose.Model} model
   * @param {Object} conditions     查询条件
   * @param {Object|String} sort    排序规则
   */
  function Paginate(model, conditions, sort) {
    this.model = model;
    this.conditions = conditions || {};
    this.query = model.find(conditions).lean();
    if (sort) {
      this.query = this.query.sort(sort);
    }
  }

  /**
   * 执行分页查询操作
   * @param  {Number}   pageIndex 当前页数
   * @param  {Number}   pageSize  每页返回记录数
   * @param  {Function} callback
   *  - err
   *  - count    总记录数
   *  - docs     每页的记录
   */
  Paginate.prototype.exec = function(pageIndex, pageSize, callback) {
    var query = this.query
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize);
    this.model.count(this.conditions, function(err, count) {
      if (err) {
        return callback(err);
      }
      query.exec(function(err, docs) {
        callback(err, count, docs);
      });
    });
  };

  /**
   * 执行不分页的查询操作
   * @param  {Function} callback
   *  - err
   *  - docs    符合条件的记录
   */
  Paginate.prototype.execQuery = function(callback) {
    this.query.exec(callback);
  };

  return function(schema) {
    /**
     * 分页获取记录
     * @param  {Object}   conditions 查询条件
     * @param  {Object}   options    分页选项
     *  - sort       {Object|String}   排序规则
     *  - notPaged   {Boolean}         不分页
     *  - pageIndex  {Number}          当前页数
     *  - pageSize   {Number}          每页返回记录数
     * @param  {Function} callback
     *  - err
     *  - count|docs    符合查询条件的总记录数。如果不分页(notPaged === true)，则传回记录列表
     *  - docs          每页的记录。如果不分页(notPaged === true)，不传入第三个参数
     */
    schema.statics.paginate = function(conditions, options, callback) {
      if (typeof conditions === 'function') {
        callback = conditions;
        conditions = {};
        options = {};
      } else if (typeof options === 'function') {
        callback = options;
        options = {};
      }

      var sort = options.sort || defaultSort,
        notPaged = typeof options.notPaged !== 'undefined' ?
            options.notPaged : false,
        pageIndex = options.pageIndex || 1,
        pageSize = options.pageSize || 20,
        paginate = new Paginate(this, conditions, sort);

      if (notPaged) {
        return paginate.execQuery(callback);
      }

      paginate.exec(pageIndex, pageSize, callback);
    };
  };
};