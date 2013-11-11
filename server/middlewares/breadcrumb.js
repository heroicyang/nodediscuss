/**
 * 面包屑导航中间件
 * @author heroic
 */

/**
 * Breadcrumbs singleton constructor
 */
var Breadcrumbs = (function() {
  var bds = [];
  function BreadcrumbsCtor() {}

  /**
   * 添加面包屑导航数据
   * @param {String|Object|Array} title  面包屑标题
   *  - String: 即为普通的 title
   *  - Object: 含有 title、url 键值对的对象
   *  - Array: 含有 title、url 键值对对象组成的数组
   * @param {String} url   面包屑链接
   *  - 如果没有 url 参数时，则代表是当前所在节点
   *  - 当第一个参数为 Object 和 Array 时，此参数无意义
   */
  BreadcrumbsCtor.prototype.add = function(title, url) {
    var type = Object.prototype.toString.call(title);

    if (type === '[object Object]') {
      bds.push(title);
    } else if (type === '[object Array]') {
      bds = bds.concat(title);
    } else {
      bds.push({
        title: title,
        url: url
      });
    }
  };

  /**
   * 返回所有的面包屑导航数据
   * @return {Array} title、url 键值对对象所组成的数组
   */
  BreadcrumbsCtor.prototype.get = function() {
    return bds;
  };

  /**
   * 清空当前面包屑数据
   */
  BreadcrumbsCtor.prototype.clear = function() {
    bds = [];
  };

  //  返回单例对象
  return function() {
    if (!BreadcrumbsCtor.instance) {
      BreadcrumbsCtor.instance = new BreadcrumbsCtor();
    }
    return BreadcrumbsCtor.instance;
  };
}());

/**
 * 初始化面包屑导航中间件
 * @param  {Object} opts 初始化参数
 *  - homeTitle   面包屑上的主页标题 ['Home']
 *  - homeUrl     面包屑上的主页链接 ['/']
 * @return {Function}    Express 中间件
 */
exports.init = function(opts) {
  opts = opts || {};

  var homeTitle = opts.homeTitle || 'Home',
    homeUrl = opts.homeUrl || '/',
    breadcrumbs = new Breadcrumbs();

  return function(req, res, next) {
    breadcrumbs.clear();
    breadcrumbs.add(homeTitle, homeUrl);
    req.breadcrumbs = function(title, url) {
      if (arguments.length === 0) {
        return breadcrumbs.get();
      }
      breadcrumbs.add(title, url);
    };
    next();
  };
};