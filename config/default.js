module.exports = exports = {
  debug: false,
  host: 'localhost',
  port: '8080',
  name: 'CNode',
  title: 'CNode: Node.js 中文技术社区',
  description: 'CNode: Node.js 中文技术社区',

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
  },

  // 分页配置
  pagination: {
    pageSize: 20,     // 每页显示的记录数量
  },

  // Gravatar 头像
  avatarProvider: {
    protocol: 'http',
    host: 'gravatar.qiniudn.com',
    pathname: '/avatar/%s',   // %s 占位符将格式化为 email 的 md5 hash
    search: 's=%d',          // %d 占位符将格式化为头像的大小
    size: 48
  },

  // 邮件发送服务
  mailer: {
    // strategy 代表采用何种邮件发送策略
    // options 即该种发送策略需要的配置选项
    strategy: 'nodemailer',    // 使用 nodemailer 来发送邮件
    sender: 'no-reply@cnodejs.org',       // 发件人 Email
    senderName: 'CNode',   // 发件人名称
    options: {
      host: 'smtp.gmail.com',
      secureConnection: true,
      port: 465,
      auth: {
        user: '',
        pass: ''
      }
    }
  },
  // 文件上传服务
  uploader: {
    strategy: 'local',  // 使用 local 策略上传到本地目录，即上面的  media 中指定的 uploadPath
    options: {}   // 如果使用第三方文件服务器（如 S3），则填写需要的配置项
    /*  Examples:
    strategy: 'qiniu',   // 使用 qiniu 策略将文件上传到七牛云存储
    options: {
      accessKey: 'your access key',
      secretKey: 'your secret key',
      bucket: 'your bucket name',
      domain: 'http://{bucket}.u.qiniudn.com'
    }
     */
  }
};