const Router = require('koa-router')

const router = new Router({
  prefix: '/api/store/v1/product'
})

const {
  Product
} = require('../../../models/product')

const {
  PositiveIntegerValidator,
  PaginationValidator
} = require('../../../validators/validator')

/**
 * 获取最近新品
 */
router.get('/recent', async (ctx, next) => {
  const products = await Product.getRecent(ctx.query.count || 15)
  Product.prototype.exclude = ['from', 'category_id', 'update_time', 'delete_time', 'create_time']
  ctx.body = products
})

/**
 * 根据分类获取产品
 */
router.get('/by_category', async (ctx, next) => {
  const params = await new PositiveIntegerValidator().validate(ctx)
  const products = await Product.getPorductByCategory(params.id)
  Product.prototype.exclude = ['from', 'category_id', 'update_time', 'delete_time', 'create_time']
  ctx.body = products
})

/**
 * 获取所有的商品
 */
router.get('/all', async (ctx, next) => {
  const params = await new PaginationValidator().validate(ctx)
  const products = await Product.getPaginationProduct(params)
  ctx.body = {
    errCode: 0,
    data: products,
    errMsg: '操作成功'
  }
})

/**
 * 获取产品详情
 */
router.get('/:id', async (ctx, next) => {
  const params = await new PositiveIntegerValidator().validate(ctx)
  const product = await Product.getPorductById(params.id)
  Product.prototype.exclude = ['from', 'category_id', 'update_time', 'delete_time', 'create_time']
  ctx.body = product
})

module.exports = router