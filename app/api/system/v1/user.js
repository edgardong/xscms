const Router = require('koa-router')
const router = new Router({
  prefix: '/api/system/v1/user'
})
const {
  User
} = require('../../../models/user')
const {
  Role
} = require('../../../models/system/role')

const {
  PaginationValidator,
  PositiveIntegerValidator,
  UserFormValidator
} = require('../../../validators/validator')

/**
 * 获取用户列表
 */
router.get('/pagination', async (ctx, next) => {
  const params = await new PaginationValidator().validate(ctx)
  const result = await User.getPaginationUser(params)
  ctx.body = {
    data: result
  }
})

router.get('/roles', async (ctx, next) => {
  const data = await Role.getAll()
  ctx.body = {
    data
  }
})

router.post('/', async (ctx, next) => {
  const params = await new UserFormValidator().validate(ctx)
  const result = await User.addUser(params)
  ctx.body = {
    result
  }
})

router.put('/', async (ctx, next) => {
  const data = await new UserFormValidator().validate(ctx)
  const result = await User.updateUser(data)
  ctx.body = {
    result
  }
})

router.delete('/', async (ctx, next) => {
  const params = await new PositiveIntegerValidator().validate(ctx)
  const msg = await User.deleteUserById(params.id)
  ctx.body = {
    msg
  }
})

module.exports = router