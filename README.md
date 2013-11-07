#CNode Club

基于 [Express] + [Mongoose] 的社区系统。

##介绍

CNode Club 是 Node.js 中文技术社区系统 [Node Club] 的重写版本，是我自己折腾的一个兴趣型项目。  

目前 Node Club 所使用的依赖库版本均比较滞后，而且在信息结构上也不是很完善，所以这个所谓的重写版本其实是一个全新的项目，可能与目前的 Node Club 有很大的出入。其目的主要是实现我的一个基于 [Express] + [Mongoose] 的架构构想，但我会尽最大力度来保证现有 Node Club 数据的可移植性，争取可以用来更新到现有的 [CNode] 社区。

正在努力的开发中，欢迎反馈建议！

##安装部署

```
// install node npm mongodb grunt-cli
// run mongod
$ npm install
$ grunt  // 即可根据相应的提示进行操作
...
$ node server/server.js  // 最后启动服务器
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