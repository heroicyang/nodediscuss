# 提供各种类别邮件的发送

包括邮件发送方法、邮件模板及渲染方法。

## templates

放置各种邮件模板，使用 `jade` 编写。

## renderer.js

负责渲染各种邮件模板。

## sender.js

邮件发送逻辑。`NODE_ENV=development` 或配置中的 `debug: true` 时，只在终端打印出邮件信息；生产环境则采用 `nodemailer` 库来发送邮件。

## index.js

提供各种类别邮件的发送方法。