![NodeDiscuss](http://nodediscuss.u.qiniudn.com/assets/img/logo.png)

[![Build Status](https://travis-ci.org/heroicyang/nodediscuss.png)](https://travis-ci.org/heroicyang/nodediscuss]) [![Coverage Status](https://coveralls.io/repos/heroicyang/nodediscuss/badge.png)](https://coveralls.io/r/heroicyang/nodediscuss)  [![Dependency Status](https://david-dm.org/heroicyang/nodediscuss.png)](https://david-dm.org/heroicyang/nodediscuss) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

> NodeDiscuss: 基于 Node.js 的社区系统。

## 介绍

NodeDiscuss 起初是计划基于 Node.js 中文技术社区系统 [NodeClub] 的一个重写版本。  

不过 NodeClub 所依赖库的版本都比较滞后，貌似在信息结构上也不是很完善，于是就从头开始构建这个全新的项目，因此可能与 NodeClub 有着很大的出入。界面以及数据模型上来说还是参照 NodeClub，确切的说是 V2EX、Ruby-China 等社区的。

折腾这个项目的初衷主要是实践下自己思考的一个项目结构（基于 [Express] + [Mongoose] ），但既然坑已经挖了那还是得填的！

目前已经发布了一个最小可用版本，欢迎试用或提出建议，我会不断的完善改进！同时也欢迎贡献代码！

DEMO 请戳这里：http://nodediscuss.com/

关于项目结构的简要介绍请戳这里：https://github.com/heroicyang/nodediscuss/wiki

## 在开发环境中安装

```bash
# install node npm mongodb grunt-cli bower, and run mongod

$ git clone https://github.com/heroicyang/nodediscuss.git
$ cd nodediscuss
$ git submodule init
$ git submodule update
$ npm install & bower install
# 创建 `development` 环境的配置
$ grunt createConfig
# 然后在 config 目录下找到刚刚创建的配置文件，修改相应配置

# 构建前端
$ grunt build

# 开启另外一个 bash 窗口来启动服务
$ node server/server.js
```

## 在生产环境中安装

```bash
# install node npm mongodb grunt-cli bower, and run mongod

$ git clone https://github.com/heroicyang/nodediscuss.git
$ cd nodediscuss
$ git submodule init
$ git submodule update
$ npm install & bower install

# 创建 `production` 环境的配置
$ grunt createConfig --env=production
# 然后在 config 目录下找到刚刚创建的配置文件，修改相应配置

# 构建前端
$ grunt build --target=production

$ NODE_ENV=production node server/server.js
# 或者使用 pm2, supervisor 等来管理
$ NODE_ENV=production pm2 start server/server.js
```

## 后台管理系统

注册用户之后，将管理员的 `email` 配置到相应的配置文件中，然后即可访问`http://host:port/admin`进入后台管理。

## License

The MIT License (MIT)

Copyright (c) 2013 Heroic Yang

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[CNode]: http://cnodejs.org/
[NodeClub]: https://github.com/cnodejs/nodeclub
[Express]: http://expressjs.com/
[Mongoose]: http://mongoosejs.com/
[CNode]: http://cnodejs.org/
