/**
 * Adds validators to SectionSchema
 * @author  heroic
 */

module.exports = exports = function(schema) {
  // 验证节点组名称的有效性
  schema.path('name')
    .required(true, '节点组名称必填!')
    .validate(function(name, done) {
      var Section = this.model('Section'),
        self = this;
      Section.findOne({
        name: name
      }, function(err, section) {
        if (err) {
          return done(false);
        }
        if (section) {
          return done(section.id === self.id);
        }
        done(true);
      });
    }, '该名称已被使用。');
};