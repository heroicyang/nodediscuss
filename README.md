#CNode Club

基于 [Express] + [Mongoose] 的社区系统。

##介绍

CNode Club 是 Node.js 中文技术社区系统 [Node Club] 的重写版本，是我自己折腾的一个兴趣型项目。  

目前 Node Club 所依赖的库版本均比较滞后，而且在信息结构上也不是很完善，所以我这个所谓的重写版本其实是全新的项目，与 Node Club 可能有着很大的出入。不过这个项目的初衷主要是验证我的一个架构构想（基于 [Express] + [Mongoose] ），但是我会尽最大力度来保证现有 Node Club 数据的可移植性，争取在将来可以更新到现有的 [CNode] 社区。

正在努力的开发中，欢迎反馈建议！

##安装部署

```bash
# install node npm mongodb grunt-cli, and run mongod

$ git clone https://github.com/heroicyang/cnodeclub.git
$ cd cnodeclub
$ npm install
$ grunt                  # 查看详细的命令提示
$ grunt createConfig     # 创建 `development` 环境的配置
# 或者创建指定环境的配置文件
$ grunt createConfig --env=test
# 然后在 config 目录下找到刚刚创建的配置文件，修改相应配置

# 然后你可以运行单元测试，或者可以运行指定的测试 (model|api|controller)
$ grunt test             # or grunt test --target=model

# 然后构建前端然后运行网站
$ grunt build
# 可以指定构建目录，不过默认就是 assets
$ grunt build --dest=assets  # 如果自定义构建目录，同时请在配置文件中修改 static 配置

# 如果你运行了 grunt build，那就等 build 完之后 ctrl + c 或者单开一个 bash 来启动服务
$ node server/server.js  # 启动服务器
```

##License

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
[Node Club]: https://github.com/cnodejs/nodeclub
[Express]: http://expressjs.com/
[Mongoose]: http://mongoosejs.com/
[CNode]: http://cnodejs.org/
