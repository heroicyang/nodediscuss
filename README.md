#CNode Club

基于 [Express] + [Mongoose] 的社区系统。

##介绍

CNode Club 起初是计划基于 Node.js 中文技术社区系统 [Node Club] 的一个重写版本。  

但由于 Node Club 使用的依赖库版本都比较滞后，且在信息结构上也不是很完善，因此就丢掉了 Node Club 的历史包袱，是一个从零开始的全新项目，也与 Node Club 可能有着很大的出入。

当然我折腾这个项目的初衷主要是实践下自己思考的一个项目结构（基于 [Express] + [Mongoose] ），所以界面以及数据模型上来说还是参照 Node Club 或者是 V2EX、Ruby-China 等社区而来。不过我打算继续维护完善好这个项目，希望能成为好用的、基于 node 的社区系统之一。

目前已经发布了一个最小可用版本，欢迎试用或提出建议，我会不断的完善改进！同时也欢迎贡献代码！

DEMO 请戳这里：http://nodediscuss.com/ （还是使用的 [CNode] 的 logo 呢...）

##在开发环境中安装

```bash
# install node npm mongodb grunt-cli, and run mongod

$ git clone https://github.com/heroicyang/cnodeclub.git
$ cd cnodeclub
$ npm install
# 创建 `development` 环境的配置
$ grunt createConfig
# 然后在 config 目录下找到刚刚创建的配置文件，修改相应配置

# 构建前端
$ grunt build

# 开启另外一个 bash 窗口来启动服务
$ node server/server.js
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
