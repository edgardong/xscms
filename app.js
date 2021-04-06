const Koa = require('koa')
const parser = require('koa-bodyparser')
const xmlParser = require('koa-xml-body')
const koaStatic = require('koa-static-router')
const path = require('path')

const views = require('koa-views')

const koaBody = require('koa-body')

const catchError = require('./middlewares/exception')
const InitManager = require('./core/init')
const app = new Koa()

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', ctx.headers.origin) // 很奇怪的是，使用 * 会出现一些其他问题
  ctx.set('Access-Control-Allow-Headers', 'content-type')
  ctx.set(
    'Access-Control-Allow-Methods',
    'OPTIONS,GET,HEAD,PUT,POST,DELETE,PATCH'
  )
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
    strict:false,//设为false
    formidable: {
      maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
    },
  })
)

/**
 * 设置静态资源目录
 */
app.use(
  koaStatic([
    { dir: 'template', router: '/' },
    { dir: 'admin', router: '/admin' },
    { dir: 'static', router: '/static' },
    { dir: 'dist', router: '/html' },
  ])
)

InitManager.initCore(app)

app.listen(8030)
