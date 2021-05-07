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

router.del('/del', async (ctx,next)=> {
  const data = await new DataValidator().validate(ctx)
  const result = await BtrOrder.delOrder(data)
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

router.get('/getByMember', async (ctx, next) => {
  const params = await new DataValidator().validate(ctx)
  console.log(params
    )
  const result = await BtrOrder.findAll({
    where: {
      status: 0,
      member:params.id
    },
  })
  ctx.body = {
    data: result,
  }
})

module.exports = router
