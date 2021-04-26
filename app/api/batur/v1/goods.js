const BtrGoods = require('../../../models/batur/goods')

const BaseApi = require('../../BaseApi')
const router = new BaseApi(BtrGoods, 'batur', 'goods', 'v1')

router.get('/base', async (ctx, next) => {
  const result = await BtrGoods.findOne({
    where: {
      status: 0,
    },
  })
  ctx.body = {
    data: result,
  }
})

module.exports = router
