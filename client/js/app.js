/**
 * 定义顶层命名空间，以及将 Backbone view 抽象为 Module 的逻辑
 * @author heroic
 */

var _ = window._;
var ND = window.ND = {
  NOOP: function() {},
  /** 非 Backbone.View 模块的定义，请使用 Loader.define */
  Loader: {
    require: require,
    define: define
  },
  /**
   * 利用 requirejs 加载 Backbone View Module
   * @param  {Object}   options  模块配置项
   *  - name    必须包含模块名称
   * @param  {Function} callback 回调函数
   */
  loadModule: function(options, callback) {
    var moduleName = options.name;
    callback = callback || ND.NOOP;
    ND.Loader.require([moduleName], function(Module) {
      callback(new Module(options));
    });
  },
  /**
   * 用来做全局的事件监听和触发，代表消息的发布订阅
   *
   * Examples:
   *
   *    this.listenTo(ND.pubsub, 'channel:topic', this.onMessageReceived);
   *    this.listenTo(ND.pubsub, 'channel', this.onMessageReceived);   // all channel
   *    ND.pubsub.trigger('channel:topic', 'this is a test message');
   */
  pubsub: {}
};

/** 增强 pubsub，使其具备事件监听和触发能力  */
_.extend(ND.pubsub, Backbone.Events);

/** 将 Backbone View 抽象为模块 */
ND.Module = Backbone.View.extend({
  constructor: function(options) {
    Backbone.View.apply(this, arguments);
    this.children = [];
    this._childrenIdMap = {};
    this._build(options);
  },
  initialize: ND.NOOP,
  onReady: ND.NOOP,
  /**
   * 依次去构建该模块下面的子模块，模块结构的最终形态和 DOM 树结构类似
   * @param  {Object} options 模块配置项
   *  - name   required    模块名称必须提供
   *  - id     optional    模块 id, 如果需要在父模块对象中通过 `getChildById` 方法访问子模块对象，则提供。
   *  - data   optional    在模块中保存一些临时数据
   *  - 其余属性均为 Backbone View 所需属性
   * @api private
   */
  _build: function(options) {
    options = options || {};
    if (options.id) {
      this.id = options.id;
    }
    if (options.options) {
      this.options = this.options || {};
      _.extend(this.options, options.options);
    }
    if (options.data) {
      this.data = options.data;
    }
    if (options.parent) {
      options.parent.addChild(this);
    }

    var self = this,
      children = options.children,
      childCount = (children && children.length) || 0;

    if (childCount === 0) {
      this.onReady();
    } else {
      _.each(children, function(child) {
        var $el = $(child.el, self.$el);
        ND.loadModule(_.defaults({
          el: $el,
          parent: self
        }, child), function() {
          childCount -= 1;
          if (childCount === 0) {
            self.onReady();
          }
        });
      });
    }
  },
  /**
   * 根据 moduleMapping 配置中提供的 id 项来获取相应的子模块对象
   * @param  {String} id    模块 id
   * @api public
   */
  getChildById: function(id) {
    return this._childrenIdMap[id];
  },
  /**
   * 根据模块名称获取第一个匹配的模块对象
   * @param  {String} name   模块名称
   * @api public
   */
  getChildByModuleName: function(name) {
    return _.find(this.children, function(child) {
      return child.moduleName === name;
    });
  },
  /**
   * 根据模块名称获取所有匹配的模块对象
   * @param  {String} name   模块名称
   * @api public
   */
  getChildrenByModuleName: function(name) {
    return _.filter(this.children, function(child) {
      return child.moduleName === name;
    });
  },
  /**
   * 将子模块对象添加到父模块对象中，方便管理
   * @param {ND.Module} module   模块对象
   * @param {Number} index  添加的位置
   * @api pravite
   */
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
  /**
   * 重载 Backbone.View.remove，以便将其从父模块对象移除
   * @api public
   */
  remove: function() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    this.empty();
    Backbone.View.prototype.remove.apply(this, arguments);
  },
  /**
   * 从父模块对象中移出子模块对象
   * @param  {ND.Module} child   子模块对象
   * @api pravite
   */
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
  },
  /**
   * 如果该模块包含子模块，则将其子模块全部 remove
   */
  empty: function() {
    while (this.children.length) {
      this.children[0].remove();
    }
    this.children = [];
    this._childrenIdMap = {};
  }
});

/** 扩展 ND.Module，包装一个专门用于 Backbone.View 模块定义的方法 */
_.extend(ND.Module, {
  define: function(name, deps, callback) {
    var self = this;
    return ND.Loader.define(name, deps, function() {
      var module = callback.apply(self, arguments);
      module.prototype.moduleName = module.moduleName = name;
      return module;
    });
  }
});

/** 暂时使用 UserModel 来保存登录后的用户信息 */
ND.User = Backbone.Model.extend({
  isAuthenticated: function() {
    return !!this.get('_id');
  }
});

/** 当前访问的用户对象 */
ND.currentUser = new ND.User();

/** 模块树管理对象 */
ND.moduleTree = (function() {
  var tree = [];
  return {
    push: function(module) {
      if (_.isArray(module)) {
        tree = tree.concat(module);
      } else {
        tree.push(module);
      }
    },
    get: function() {
      return tree;
    }
  };
}());