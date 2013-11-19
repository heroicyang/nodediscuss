var _ = window._;
var NC = window.NC = {
  NOOP: function() {},
  Loader: {
    require: require,
    define: define
  },
  loadModule: function(options, callback) {
    var moduleName = options.name;
    NC.Loader.require([moduleName], function(Module) {
      callback(new Module(options));
    });
  },
  Module: Backbone.View.extend({})
};

_.extend(NC.Module, {
  define: function(name, deps, callback) {
    return NC.Loader.define(name, deps, function() {
      return callback.apply(this, arguments);
    });
  }
});