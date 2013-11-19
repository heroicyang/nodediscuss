/**
 * RequireJS 配置，只会在开发环境下用到，因为生产环境中全部会打包为一个文件
 * @author heroic
 */
(function(requirejs) {
  requirejs.config({
    baseUrl: 'js/app'
  });
}(window.requirejs));