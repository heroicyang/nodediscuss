# 放置实现各种 `Strategy` 的插件

目前包括了 `nodemailer` 插件。

## nodemailer

`libs/mailer` 的实现，提供通过 `nodemailer` 库来发送邮件的功能。

## extend.js

将目前定义的 `Strategy` 抽象类放置于此，方便其它实现者了解目前都提供了哪些插件类型。