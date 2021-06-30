const 
  BlogBase
 = require('../../../models/blog/base')

const BaseApi = require('../../BaseApi').default
const router = new BaseApi(BlogBase, 'blog', 'base', 'v1')

/**
 * 获取用户列表
 */
router.get('/base', async (ctx, next) => {
  const result = await BlogBase.findOne({
    where: {
      status: 0
    }
  })
  ctx.body = {
    data: result
  }
})

module.exports = router