# models

Mongoose Schema 定义，验证规则、中间件、类方法和实例方法的定义，以及 Mongoose 插件。

## schemas

定义 `Mongoose` 的 `Schema`，模型的字段中可以包括 `index`、`getter`、`setter`、`built-in setter`，可以定义 `virtual path`、`plugin`，然后将对应的 `schema` 和 `modelName` 暴露出去。而验证、中间件、方法等放到相应的目录中去，尽量保持模型的简洁。

## validators

定义每个模型的验证器，确保文件名与模型的文件名一致。不需要验证的模型则无需定义其验证器。

## methods

### class

定义每个 `Model` 的类方法，这些方法供其它层（比如 `controller`）调用，其它层不应该直接使用 `mongoose` 操作数据库，只能使用这些自定义的类方法。

### instance

定义每个 `Model` 的实例方法，即通过文档实例调用的。一般来说，这里面不会有太多的方法。

## middlewares

模型中间件，主要以 `pre middleware` 为主，因为只有它是带流程控制的。而 `post middleware` 则只是简单的事件触发而已，不带流程控制，一般用在队列这种场景。

`pre middleware` 里面主要做一些关联的数据操作逻辑。

## mongoose_plugins

放置一些会用到的 `mongoose plugin`，目前有 `timestamp` 和 `pagination` 两个插件，前者分别为每个模型增加 `创建时间` 和 `更新时间` 字段；后者分别为每个模型定义了分页操作的类方法。

## constants.js

定义 `models` 层要用到的常量，这些常量是真正意义上的常量，因为只可以读不可以写。

## xss.js

配置 `xss` 白名单，然后封装了对数据文档指定属性值进行 `xss` 过滤的门面方法，主要简化对模型每个要过滤字段都写一遍这段代码的重复工作。

## validate.js

自定义了 `validator` 的出错逻辑，因为 `mongoose` 的验证只需要返回 `true` 和 `false`，不需要其它值，所以需要改造下 `validator` 库对验证失败的处理。

## index.js

这里将各个 `schema` 附加上 `validate`、`method`、`middleware`、`plugin` 的特性，并将其注册到 `mongoose.models`，然后对外暴露这些 `model`。

另外，还定义了一个 `apiWrapper` 方法，用于对 `model` 的类方法进行包装，将其暴露在 `models.api` 对象中，供其它层使用。其它层应该只调用 `models.api` 中各个类的方法，不应该直接调用 `mongoose.model` 的方法。
