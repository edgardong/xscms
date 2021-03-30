const Router = require('koa-router')

const router = new Router({
  prefix: '/api/store/v1/order'
})

const {
  Order
} = require('../../../models/order')
const {
  OrderStatus
} = require('../../../lib/enum')

const {
  PositiveIntegerValidator,
  PaginationValidator
} = require('../../../validators/validator')

const {
  Auth
} = require('../../../../middlewares/auth')

/**
 * 根据当前用户获取订单
 */
router.get('/by_user', new Auth().m, async (ctx, next) => {
  const orders = await Order.getUserOrders(ctx.auth.uid, ctx.query.page)
  ctx.body = {
    data: {
      data: orders
    }
  }
})

/**
 * 下单操作
 */
router.post('/', new Auth().m, async (ctx, next) => {
  const result = await Order.placeOrder(ctx.auth.uid, ctx.request.body.products)
  ctx.body = result
})

/**
 * 分页获取订单数据
 */
router.get('/pagination', new Auth().m, async (ctx, next) => {
  const params = await new PaginationValidator().validate(ctx)
  const orders = await Order.getPaginationOrders(params)

  ctx.body = {
    errCode: 0,
    data: orders,
    errMsg: '操作成功'
  }
})

/**
 * 获取订单详情
 */
router.get('/:id', new Auth().m, async (ctx, next) => {
  const data = await new PositiveIntegerValidator().validate(ctx)
  const result = await Order.findOne({
    where: {
      id: data.id
    }
  })

  ctx.body = result
})

/**
 * 订单送货
 */
router.put('/deliver', new Auth().m, async (ctx, next) => {
  const params = await new PositiveIntegerValidator().validate(ctx)
  const data = await Order.update({
    status: OrderStatus.DELIVERED
  }, {
    where: {
      id: params.id,
    }
  })

  ctx.body = {
    errCode: 0,
    data,
    errMsg: '操作成功'
  }
})

module.exports = router