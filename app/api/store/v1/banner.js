const Router = require('koa-router')
const router = new Router({
  prefix: '/api/store/v1/banner'
})

const {
  Banner
} = require('../../../models/banner')

const {
  PositiveIntegerValidator
} = require('../../../validators/validator')

/**
 * 获取轮播图
 */
router.get('/:id', async (ctx, next) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const banners = await Banner.getBanner(v.id)
  ctx.body = {
    items: banners
  }
})

module.exports = router