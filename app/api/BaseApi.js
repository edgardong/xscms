const Router = require('koa-router')

const {
  PaginationValidator,
  PositiveIntegerValidator,
  WecValidator
} = require('../validators/validator')

class BaseApi {
  constructor(entity, module = 'system', model = 'role', version = 'v1') {
    const prefix = `/api/${module}/${version}/${model}`
    const router = new Router({
      prefix
    })

    /**
     * 获取用户列表
     */
    router.get('/pagination', async (ctx, next) => {
      const params = await new PaginationValidator().validate(ctx)
      const data = await entity.getPagination(params)
      ctx.body = {
        data
      }
    })

    router.get('/all', async (ctx, next) => {
      const data = await entity.getAll()
      ctx.body = {
        data
      }
    })

    router.post('/', async (ctx, next) => {
      const params = await new WecValidator().validate(ctx)
      const result = await entity.addData(params)
      ctx.body = {
        result
      }
    })

    router.put('/', async (ctx, next) => {
      const data = await new WecValidator().validate(ctx)
      const result = await entity.updateData(data)
      ctx.body = {
        result
      }
    })

    router.delete('/', async (ctx, next) => {
      const params = await new PositiveIntegerValidator().validate(ctx)
      const msg = await entity.deleteById(params.id)
      ctx.body = {
        msg
      }
    })

    return router
  }

}

module.exports = BaseApi