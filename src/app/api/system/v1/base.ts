import KoaRouter from "../../Router";

// import Entitys from '../../../models/system/base'

// const { getEntityColumns } = require('../../../models/system/baseUtils')

// import validators from '@xscms/validators/validator'

const router = new KoaRouter({
  prefix: '/api/system/v1/base',
})

// /**
//  * 获取用户列表
//  */
// router.get('/pagination', async (ctx, next) => {
//   const params = await new PaginationValidator().validate(ctx)
//   const entity = Entitys[params.model]
//   if (params.model === 'xyorder') {
//     params.order = ['date', 'desc']
//   }
//   const data = await entity.getPagination(params)
//   ctx.body = {
//     data,
//   }
// })

router.get('/all', async (ctx, next) => {
  // const params = await new validators.WecValidator().validate(ctx)
  // const entity = Entitys[params.model]
  // // console.log(params)
  // const data = await entity.getAll(
  //   params.where || {},
  //   {
  //     order: params.order,
  //   } || {}
  // )
  ctx.body = {
    ctx,
  }
})

// /**
//  * 获取基本实体的列
//  */
// router.get('/columns', async (ctx, next) => {
//   const params = await new WecValidator().validate(ctx)
//   // let department = await Entitys.department.entity.findAll()
//   const entity = Entitys[params.model]
//   const data = await getEntityColumns(params.model)
//   // console.log('我的部门数据',data)
//   ctx.body = data
// })

// router.post('/', async (ctx, next) => {
//   const params = await new WecValidator().validate(ctx)
//   const entity = Entitys[params.model]
//   const result = await entity.addData(params)
//   ctx.body = {
//     result,
//   }
// })

// router.put('/', async (ctx, next) => {
//   const params = await new WecValidator().validate(ctx)
//   const entity = Entitys[params.model]
//   const result = await entity.updateData(params)
//   ctx.body = {
//     result,
//   }
// })

// router.delete('/', async (ctx, next) => {
//   const params = await new PositiveIntegerValidator().validate(ctx)
//   const entity = Entitys[params.model]
//   const msg = await entity.deleteById(params.id)
//   ctx.body = {
//     msg,
//   }
// })

// module.exports = router
