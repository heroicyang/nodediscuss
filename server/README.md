# 网站入口

Express 的相关配置，路由、控制逻辑、视图等。

## controllers

路由相应的控制逻辑。

## middlewares

目前使用到的 Express 中间件（包括路由中间件）。

### auth.js

定义了进行权限拦截的路由中间件。

### breadcrumb.js

实现面包屑导航的 Express 中间件。

### error_handling.js

错误处理中间件。

### flash.js

在请求直接传递消息的中间件。

### locals.js

定义了所有模板渲染需要用到的公用变量。

### passport.js

利用 `passport` 库来管理各种登录策略，其中主要是对 `passport` 的配置。

## utils

放置 `server` 层会用到的工具类等。

## views

放置各种视图模板。

## api.js

引用了 `models` 层提供的 `api` 对象，方便在 `server` 层使用。同时定义了 `requestHandler` 方法，用于将 `api` 直接包装后来响应请求。

## mongodb.js

其中定义了 `mongodb` 的连接逻辑。

## routes.js

路由配置。

## server.js

Express 服务器的配置和启动，程序入口。

## setting.js

Express 的相关配置。

## uploader.js

配置 `express-fileuploader` 插件，提供上传图片的请求处理。