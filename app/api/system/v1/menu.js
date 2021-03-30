const Router = require('koa-router')
const router = new Router({
  prefix: '/api/system/v1/menu'
})
const {
  Menu
} = require('../../../models/system/menu')
const {
  RoleMenu
} = require('../../../models/system/roleMenu')

const {
  PaginationValidator,
  PositiveIntegerValidator,
  MenuFormValidator,
  TypeValidator,
  WecValidator
} = require('../../../validators/validator')

/**
 * 获取用户列表
 */
router.get('/pagination', async (ctx, next) => {
  const params = await new PaginationValidator().validate(ctx)
  params.order = ['order']
  const result = await Menu.getPagination(params, {
    pid: null
  }, {
    include: [{
      model: Menu,
      as: 'children'
    }]
  })
  ctx.body = {
    data: result
  }
})

router.get('/all', async (ctx, next) => {
  const params = await new TypeValidator().validate(ctx)
  const data = await Menu.getAll(params.type)
  ctx.body = {
    data
  }
})

router.get('/tree', async (ctx, next) => {
  const data = await Menu.getTreeData()
  ctx.body = {
    data
  }
})

router.get('/byrole', async(ctx, next)=> {
  const params = await new WecValidator().validate(ctx)
  const where = {
    role: params.roleId
  }
  const data = await RoleMenu.getAll(where)
  ctx.body = {
    data
  }
})

router.post('/byrole', async (ctx,next) => {
  const params = await new WecValidator().validate(ctx)
  const data = await RoleMenu.saveByRole(params)
  ctx.body = {
    data
  }
})

router.post('/', async (ctx, next) => {
  const params = await new MenuFormValidator().validate(ctx)
  const result = await Menu.addData(params)
  ctx.body = {
    result
  }
})

router.put('/', async (ctx, next) => {
  const data = await new MenuFormValidator().validate(ctx)
  const result = await Menu.updateData(data)
  ctx.body = {
    result
  }
})

router.delete('/', async (ctx, next) => {
  const params = await new PositiveIntegerValidator().validate(ctx)
  const msg = await Menu.deleteById(params.id)
  ctx.body = {
    msg
  }
})

module.exports = router