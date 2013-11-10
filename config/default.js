module.exports = exports = {
  debug: false,
  host: 'localhost',
  port: '8080',
  title: 'CNode: Node.js 中文技术社区',
  session: {
    secret: '',  // 留空时则会以 config/index.js 中生成的随机字串为准 (建议留空)
    maxAge: 6.048e+8  // ms, 7 x 24 x 60 x 60 x 1000
  },

  // MongoDB 配置
  mongo: {
    db: 'cnodeclub',
    // 支持 replSet (Replica Set)
    servers: [
      '127.0.0.1:27017'  // 主服务器地址
      //, '192.168.1.xxx:27017'  // 其余 replSet 服务器地址
    ]
  },

  // 前端 css 文件、js 文件等静态资源配置
  static: {
    // 留空代表使用本地服务器，否则请填写静态文件服务器的地址
    host: '',
    // 如果 host 为空，则以下配置均是基于 `process.cwd()` 来进行 `path.join`，且
    // ...express.static 会配置为该目录。
    // 如果有 host，则代表使用静态文件服务器,且不会配置 express.static
    cwd: '/assets'
  },

  // 上传的图片、文件等媒体资源配置，属性含义与 static 一致
  // 注：当使用 amazon s3 或者 qiniu 云存储之类，此节点配置同样生效，将
  // ...会在云存储 bucket 下建立如下配置的文件夹信息
  media: {
    host: '',
    cwd: '/assets',
    uploadPath: '/uploads'  // 以 `media.cwd` 为基准进行 `path.join`
  }
};