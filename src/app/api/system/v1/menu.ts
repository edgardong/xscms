import KoaRouter from '../../Router'
const router = new KoaRouter({
  prefix: '/api/system/v1/menu',
})
// const Menu = require('../../../models/system/menu')
// const RoleMenu = require('../../../models/system/roleMenu')
import Auth from '../../../../middlewares/auth'
import validate from '../../../validators/validator'

/**
 * 获取列表
 */
// router.get('/pagination', new Auth().m, async (ctx, next) => {
//   // const params = await new PaginationValidator().validate(ctx)
//   params.order = ['order']
//   const result = await Menu.getPagination(
//     params,
//     {
//       pid: null,
//       status: 0,
//     },
//     {
//       include: [
//         {
//           model: Menu,
//           as: 'children',
//         },
//       ],
//     }
//   )
//   ctx.body = {
//     data: result,
//   }
// })

router.get('/all', new Auth().m, async (ctx, next) => {
  const params = await new validate.TypeValidator().validate(ctx)
  // const auth = ctx.auth
  // const data = await Menu.getAll(params, auth)
  console.log('.....', params)
  ctx.body = '请求成功'
})

// router.get('/tree', async (ctx, next) => {
//   const data = await Menu.getTreeData()
//   ctx.body = {
//     data,
//   }
// })

// router.get('/byrole', new Auth().m, async (ctx, next) => {
//   const params = await new WecValidator().validate(ctx)
//   const where = {
//     role: params.roleId,
//   }
//   const data = await RoleMenu.getAll(where)
//   ctx.body = {
//     data,
//   }
// })

// router.post('/byrole', new Auth().m, async (ctx, next) => {
//   const params = await new WecValidator().validate(ctx)
//   const data = await RoleMenu.saveByRole(params)
//   ctx.body = {
//     data,
//   }
// })

// router.post('/', async (ctx, next) => {
//   const params = await new MenuFormValidator().validate(ctx)
//   const result = await Menu.addData(params)
//   ctx.body = {
//     result,
//   }
// })

// router.put('/', async (ctx, next) => {
//   const data = await new MenuFormValidator().validate(ctx)
//   const result = await Menu.updateData(data)
//   ctx.body = {
//     result,
//   }
// })

// router.delete('/', async (ctx, next) => {
//   const params = await new PositiveIntegerValidator().validate(ctx)
//   const msg = await Menu.deleteById(params.id)
//   ctx.body = {
//     msg,
//   }
// })

export default router
