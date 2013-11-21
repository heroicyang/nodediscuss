var _ = window._;
var NC = window.NC = {
  NOOP: function() {},
  Loader: {
    require: require,
    define: define
  },
  loadModule: function(options, callback) {
    var moduleName = options.name;
    callback = callback || NC.NOOP;
    NC.Loader.require([moduleName], function(Module) {
      callback(new Module(options));
    });
  },
  Module: Backbone.View.extend({
    constructor: function(options) {
      Backbone.View.apply(this, arguments);
      this.children = [];
      this._childrenIdMap = {};
      this._build(options);
    },
    initialize: function() {},
    _build: function(options) {
      options = options || {};
      if (options.id) {
        this.id = options.id;
      }
      if (options.data) {
        this.data = options.data;
      }
      if (options.parent) {
        options.parent.addChild(this);
      }

      var self = this,
        children = options.children;

      _.each(children, function(child) {
        var $el = $(child.el, self.$el);
        NC.loadModule(_.defaults({
          el: $el,
          parent: self
        }, child));
      });
    },
    getChildById: function(id) {
      return this._childrenIdMap[id];
    },
    getChildByModuleName: function(name) {
      return _.find(this.children, function(child) {
        return child.moduleName === name;
      });
    },
    getChildrenByModuleName: function(name) {
      return _.filter(this.children, function(child) {
        return child.moduleName === name;
      });
    },
    addChild: function(module, index) {
      var idx = -1;
      if (typeof index !== 'undefined') {
        idx = index;
      }

      if (module.parent !== this) {
        if (module.parent) {
          module.remove();
        }
        module.parent = this;
      }

      if (idx === -1) {
        this.children.push(module);
      } else {
        this.children.splice(idx, 0, module);
      }

      if (module.id) {
        this._childrenIdMap[module.id] = module;
      }
    },
    remove: function() {
      if (this.parent) {
        this.parent.removeChild(this);
      }
      Backbone.View.prototype.remove.apply(this, arguments);
    },
    removeChild: function(child) {
      if (child.parent !== this) {
        return;
      }
      child.parent = null;
      this.children = _.filter(this.children, function(item) {
        return child !== item;
      });
      if (child.id) {
        delete this._childrenIdMap[child.id];
      }
    }
  })
};

_.extend(NC.Module, {
  define: function(name, deps, callback) {
    var self = this;
    return NC.Loader.define(name, deps, function() {
      var module = callback.apply(self, arguments);
      module.prototype.moduleName = module.moduleName = name;
      return module;
    });
  }
});