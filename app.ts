/*
 * @Author: yishusheng
 * @Date: 2021-03-26 18:13:07
 * @version: 1.0.0
 * @LastEditTime: 2021-07-07 18:34:36
 * @LastEditors: yishusheng
 * @Description: 项目入口文件
 */

import "reflect-metadata"
import * as Koa from 'koa'
import * as xmlParser from 'koa-xml-body'
import * as koaStatic from 'koa-static'

import * as views from 'koa-views'
import * as koaBody from 'koa-body'

import catchError from './src/middlewares/exception'
import InitManager from './src/core/init'
const app = new Koa()
app.use(async (ctx, next) => {
  // ctx.set('Access-Control-Allow-Origin', ctx.headers.origin) // 很奇怪的是，使用 * 会出现一些其他问题
  ctx.set('Access-Control-Allow-Origin', '*') // 很奇怪的是，使用 * 会出现一些其他问题
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE')
  ctx.set('Access-Control-Allow-Headers', 'x-requested-with, accept, origin, content-type, source, platform, os, Authorization, version')
  // await next()
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200
  } else {
    await next()
  }
})

app.use(views(__dirname, { extension: 'pug' }))

app.use(catchError)
app.use(xmlParser())
// app.use(parser())
app.use(
  koaBody({
    multipart: true,
    strict: false, //设为false
    formidable: {
      maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
    },
  })
)

InitManager.initCore(app)

// 接口文档相关配置
import swagger from './swagger'
// import { koaSwagger } from 'koa2-swagger-ui'

// 接口文档配置
app.use((swagger as any).routes())
app.use((swagger as any).allowedMethods())
// app.use(koaSwagger({
//   routePrefix: '/swagger', // 接口文档访问地址
//   swaggerOptions: {
//     url: '/swagger.json', // example path to json 其实就是之后swagger-jsdoc生成的文档地址
//   }
// }))

/**
 * 设置静态资源目录
 */
app.use(koaStatic(__dirname + '/static'))
app.use(koaStatic(__dirname + '/public'))
app.use(koaStatic(__dirname + '/admin'))

app.listen(8030)
