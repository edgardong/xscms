const Router = require('koa-router')

const router = new Router({
  prefix: '/api/store/v1/area'
})

const Area = require('../../../models/area')
const {
  PositiveIntegerValidator
} = require('../../../validators/validator')
/**
 * 获取所有省市县数据
 */
router.get('/all', async (ctx, next) => {
  const areas = await Area.getAll()
  ctx.body = areas
})

router.get('/list', async (ctx, next) => {
  const data = await new PositiveIntegerValidator().validate(ctx)
  const areas = await Area.getChildAreas(data.id)
  ctx.body = areas
})

module.exports = router