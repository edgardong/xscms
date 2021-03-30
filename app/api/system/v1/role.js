const {
  Role
} = require('../../../models/system/role')

const BaseApi = require('../../BaseApi')
const router = new BaseApi(Role, 'system', 'role', 'v1')


const {
  WecValidator
} = require('../../../validators/validator')

router.get('/permission/op', async (ctx, next) => {
  const params = await new WecValidator().validate(ctx)
  const data = await Role.getOperatePermission(params.role)
  ctx.body = {
    data
  }
})

router.post('/permission/op', async (ctx, next) => {
  const params = await new WecValidator().validate(ctx)
  const data = await Role.saveOperatePermission(params.data)
  ctx.body = {
    data
  }
})

router.get('/permission/dataType', async (ctx, next) => {
  // const params = await new WecValidator().validate(ctx)
  const data = await Role.getDataPermissionTypes()
  ctx.body = {
    data
  }
})

router.get('/permission/data', async (ctx, next) => {
  const params = await new WecValidator().validate(ctx)
  const data = await Role.getDataPermission(params.role)
  ctx.body = {
    data
  }
})

router.post('/permission/data', async (ctx, next) => {
  const params = await new WecValidator().validate(ctx)
  const data = await Role.saveDataPermission(params.data)
  ctx.body = {
    data
  }
})

module.exports = router