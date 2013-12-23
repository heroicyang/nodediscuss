module.exports = exports = {
  debug: false,
  proxy: false,  // 使用 nginx 等做代理时请设置为 true
  host: 'localhost:8080',
  port: '8080',
  logo: '',
  name: 'NodeDiscuss',
  title: 'NodeDiscuss: Node.js 中文交流社区',
  description: 'Node.js 中文交流社区',
  // 自定义页面 meta 信息
  headers: [
    // [name, content]
    ['author', 'me@heroicyang.com']
  ],
  // 自定义页面底部导航
  footerNavs: [
    // [url, text, [target]]
    ['/about', '关于'],
    ['https://github.com/heroicyang/nodediscuss', 'GitHub', '_blank']
  ],
  weiboAppKey: '',    // 新浪微博 appkey

  adminEmails: [],   //  管理员用户们的 email 列表

  session: {
    secret: '',
    maxAge: 6.048e+8  // ms, 7 x 24 x 60 x 60 x 1000
  },

  // MongoDB 配置
  mongo: {
    db: 'nodediscuss',
    // 支持 replSet (Replica Set)
    servers: [
      '127.0.0.1:27017'  // 主服务器地址
      //, '192.168.1.xxx:27017'  // 其余 replSet 服务器地址
    ]
  },

  // 前端 css 文件、js 文件等静态资源配置
  static: {
    // 留空代表使用本地服务器，否则请填写静态文件服务器的地址(加上 `http[s]://` 前缀)
    domain: '',
    // 如果 domain 为空，则 `express.static` 会配置该目录为静态目录。
    cwd: '/assets'
  },

  // 上传的图片、文件等媒体资源配置
  media: {
    // 留空代表使用本地服务器，否则请填写静态文件服务器的地址(加上 `http[s]://` 前缀)
    // Examples: 'http://{bucket}.u.qiniudn.com'
    domain: '',
    // 如果 domain 为空，则 `express.static` 会配置该目录为静态目录。
    cwd: '/assets',
    // 上传文件的目录，位于 cwd 目录下
    uploadPath: '/uploads'
  },

  // 分页配置
  pagination: {
    pageSize: 20     // 每页显示的记录数量
  },

  // Gravatar 头像服务配置
  avatarProvider: {
    protocol: 'http',
    host: 'gravatar.com',
    pathname: '/avatar/%s',   // %s 占位符将格式化为 email 的 md5 hash
    search: 's=%d',          // %d 占位符将格式化为头像的大小
    size: 80
  },

  // 邮件发送服务配置
  mailer: {
    // strategy 采用哪种邮件发送策略
    // options  相应发送策略所需要的配置项
    strategy: 'log',
    sender: 'no-reply@nodediscuss.com',
    senderName: 'NodeDiscuss',
    options: {}
    /*  Examples:
    // 使用 nodemailer 来发送邮件
    strategy: 'nodemailer',
    sender: 'no-reply@nodediscuss.com',
    senderName: 'NodeDiscuss',
    options: {
      host: 'smtp.gmail.com',
      secureConnection: true,
      port: 465,
      auth: {
        user: '',
        pass: ''
      }
    }
    */
  },
  // 文件上传服务配置
  uploader: {
    // strategy 采用哪种文件上传策略
    // options  相应上传策略所需要的配置项
    strategy: 'local',
    options: {}
    /*  Examples:
    // 使用 qiniu 策略将文件上传到七牛云存储
    strategy: 'qiniu',
    options: {
      accessKey: 'your access key',
      secretKey: 'your secret key',
      bucket: 'your bucket name',
      domain: 'http://{bucket}.u.qiniudn.com'
    }
    */
  },

  // 相关站点信息配置
  links: [
    // { url: '', text: '' }
  ],

  // 广告位信息配置
  ads: [
    // { url: '', text: '' [, image: ''] }
  ]
};