const BtrMember = require('../../../models/batur/member')

const BaseApi = require('../../BaseApi')
const router = new BaseApi(BtrMember, 'batur', 'member', 'v1')

/**
 * 获取用户列表
 */
router.get('/base', async (ctx, next) => {
  const result = await BtrMember.findOne({
    where: {
      status: 0,
    },
  })
  ctx.body = {
    data: result,
  }
})

module.exports = router
