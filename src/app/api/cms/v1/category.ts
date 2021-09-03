// import Router from 'koa-router'
// const router = new Router({
//   prefix: '/api/blog/v1/category'
// })

// import Category, { prototype, getAllCategory, getTreeData, getPagination, create, update, destroy } from '../../../models/blog/category'
// import { getAllTag } from '../../../models/blog/tags'

// import {
//   PaginationValidator, PositiveIntegerValidator, WecValidator
// } from '../../../validators/validator'

// /**
//  * 获取博客分类
//  */
// router.get('/', async (ctx, next) => {
//   prototype.exclude = ['create_time', 'parent', 'status']
//   const result = await getAllCategory()
//   ctx.body = result
// })

// router.get('/tree', async (ctx, next) => {
//   const data = await getTreeData()
//   ctx.body = {
//     data
//   }
// })

// router.get('/pagination', async (ctx, next) => {
//   const params = await new PaginationValidator().validate(ctx)
//   params.order = ['order']
//   const result = await getPagination(params, {
//     parent: null
//   }, {
//     include: [{
//       model: Category,
//       as: 'children'
//     }]
//   })
//   ctx.body = {
//     data: result
//   }
// })

// /**
//  * 获取博客分类
//  */
// router.get('/all', async (ctx, next) => {
//   prototype.exclude = []
//   const data = await getAllCategory()
//   ctx.body = {
//     data
//   }
// })

// router.get('/hottag', async (ctx, next) => {
//   const data = await getAllTag()
//   ctx.body = {
//     data
//   }
// })

// /**
//  * 添加文章分类
//  */
// router.post('/', async (ctx, next) => {
//   const data = {
//     status: 0,
//     ...ctx.request.body
//   }
//   const result = await create(data)
//   ctx.body = {
//     msg: '操作成功'
//   }
// })

// /**
//  * 更新博客分类
//  */
// router.put('/', async (ctx, next) => {
//   const data = {
//     status: 0,
//     ...ctx.request.body
//   }
//   const result = await update(data, {
//     where: {
//       id: ctx.request.body.id
//     }
//   })
//   ctx.body = {
//     msg: '更新成功'
//   }
// })

// /**
//  * 删除博客分类
//  */
// router.delete('/', async (ctx, next) => {
//   const result = await destroy({
//     where: {
//       id: ctx.request.body.id
//     }
//   })
//   ctx.body = {
//     msg: '删除成功'
//   }
// })

// export default router