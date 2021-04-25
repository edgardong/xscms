const BtrOrder = require('../../../models/batur/order')

const BaseApi = require('../../BaseApi')
const router = new BaseApi(BtrOrder, 'batur', 'order', 'v1')

/**
 * 获取用户列表
 */
router.get('/base', async (ctx, next) => {
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
