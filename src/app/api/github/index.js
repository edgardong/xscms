const Router = require('koa-router')
const router = new Router({
  prefix: '/api/github',
})
const logUtils = require('../../../core/logUtils')
const jobs = require('./job')
const verify = require('./verify').verify
/**
 * github webhooks
 */
router.post('/webhooks/:name', verify, async (ctx, next) => {
  let name = ctx.params.name
  jobs.run(name)
  ctx.body = 'success'
  // handler(ctx.req, ctx.response, function (err) {
  //   ctx.response.statusCode = 404
  //   if (err) {
  //     ctx.body = { err }
  //   } else {
  //     ctx.body = 'no'
  //   }
  // })
})

/**
 * github webhooks
 */
router.get('/test', async (ctx, next) => {
  logUtils.logError(ctx, 'error test', new Date())
  ctx.body = '成功了，恭喜你呀'
})

module.exports = router
