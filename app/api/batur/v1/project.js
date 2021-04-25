const BtrProject = require('../../../models/batur/project')

const BaseApi = require('../../BaseApi')
const router = new BaseApi(BtrProject, 'batur', 'project', 'v1')

/**
 * 获取用户列表
 */
router.get('/base', async (ctx, next) => {
  const result = await BtrProject.findOne({
    where: {
      status: 0,
    },
  })
  ctx.body = {
    data: result,
  }
})

module.exports = router
