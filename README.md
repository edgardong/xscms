### xs-cms

### 说明

基于``koa2`` ``typeorm``开发的CMS管理系统

使用[wec-tools](https://www.quzhaota.cn/)工具类

#### 文件目录说明
````shell
.
├── admin                   后端管理的代码
├── app                     应用主目录
│   ├── api                 api目录
│   ├── lib                 公用文件目录
│   ├── models              实体文件目录
│   ├── services            服务目录
│   └── validators          验证器目录
├── plugins                 插件文件目录
├── docs                    文档目录
│   └── api
├── logs                    日志目录
├── middlewares             中间件目录
├── node_modules            系统依赖的目录
├── LICENSE                 项目许可证文件
├── README.md               项目说明文件
├── app.js                  系统入口文件
├── package-lock.json       依赖版本锁定文件
├── package.json            项目依赖文件
├── pm2.conf.json           pm2配置文件
└── static                  静态资源目录


````


#### 功能简介

1. 添加文章
2. 添加分类
3. 添加频道
4. ....


TODO LIST

**V1 版本功能**

**重构功能**

- [ ] 用户
- [ ] 菜单
- [ ] 权限

**新增加功能**

- [ ] 系统自动安装功能
- [ ] 提供用户注册功能，多用户发布文章
- [ ] 提供投稿功能


#### 使用``TypeScript``+``Typeorm``重构整个项目