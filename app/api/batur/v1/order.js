const BtrOrder = require('../../../models/batur/order')
const { DataValidator } = require('../../../validators/validator')

const BaseApi = require('../../BaseApi')
const router = new BaseApi(BtrOrder, 'batur', 'order', 'v1')

/**
 * 添加用户订单
 */
router.post('/addOrder', async (ctx, next) => {
  const data = await new DataValidator().validate(ctx)

  const result = await BtrOrder.addOrder(data)
  ctx.body = {
    data: result,
  }
})

router.put('/updateOrder', async (ctx, next) => {
  const result = await BtrOrder.findOne({
    where: {
      status: 0,
    },
  })
  ctx.body = {
    data: result,
  }
})

module.exports = router
