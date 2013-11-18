/**
 * 定义 TopicSchema 静态方法
 * @author heroic
 */

var _ = require('lodash');

/**
 * 根据 id 查询话题，并修改话题信息
 * @param  {Object}   topicData   合法的 topic json 对象，必须包含以下属性
 *  - id   话题主键
 * @param  {Function} callback    回调函数
 *  - err  MongooseError
 *  - topic 修改之后的 topic 对象
 * @return {null}
 */
exports.edit = function(topicData, callback) {
  var topicId = topicData.id;
  topicData = _.omit(topicData, ['_id', 'id']);

  this.findById(topicId, function(err, topic) {
    if (err) {
      return callback(err);
    }
    if (_.isEmpty(topicData)) {
      return callback(null, topic);
    }

    _.extend(topic, topicData);
    topic.save(callback);
  });
};


/**
 * 根据 id 删除话题
 * @param  {String}   id   话题 id
 * @param  {Function} callback  回调函数
 *  - err   MongooseError
 * @return {null}
 */
exports.destroy = function(id, callback) {
  this.findById(id, function(err, topic) {
    if (err) {
      return callback(err);
    }
    topic.remove(callback);
  });
};

/**
 * 导出一个只返回纯 json 对象结果的查询
 * 在此基础上做其它的查询操作
 * @return {Query}     Mongoose Query 对象
 */
exports.query = function() {
  return this.find().lean();
};