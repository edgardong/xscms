### xs-cms

### 说明

typeorm/sequelize

基于``koa2``开发的CMS管理系统

使用[wec-tools](https://www.quzhaota.cn/)工具类

#### 文件目录说明
````shell
.
├── app                     应用主目录
│   ├── api                 api目录
│   ├── lib                 公用文件目录
│   ├── models              实体文件目录
│   ├── services            服务目录
│   └── validators          验证器目录
├── config                  配置文件目录
├── core                    系统基础应用目录
├── docs                    文档目录
│   └── api
├── logs                    日志目录
├── middlewares             中间件目录
├── node_modules            系统依赖的目录
├── LICENSE                 项目许可证文件
├── README.md               项目说明文件
├── app.js                  系统入口文件
├── index.js                系统入口文件(测试ES6)
├── package-lock.json       依赖版本锁定文件
├── package.json            项目依赖文件
├── pm2.conf.json           pm2配置文件
└── static                  静态资源目录


````

TODO LIST

- [ ] 系统自动安装功能
- [ ] 提供用户注册功能，多用户发布文章
- [ ] 提供投稿功能
- [ ] 包含多个网站，使用nginx做反向代理
- [ ] 系统插件功能
- [ ] 编辑模版
- [ ] 制作落地页
