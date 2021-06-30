const Router = require('koa-router')

const {
  putFile
} = require('../../../services/qiniu')

const {
  PaginationValidator,
  PositiveIntegerValidator,
  WecValidator
} = require('../../../validators/validator').default

const router = new Router({
  prefix: '/api/system/v1/file'
})


router.post('/', async (ctx, next) => {
  const file = ctx.request.files.upload
  // console.log('文件参数', file)
  // const params = await new WecValidator().validate(ctx)
  const result = await putFile(file)
  console.log(result)
  ctx.body = {
    uploaded: 1,
    url: result.url,
    fileName: result.name
  }
})

// router.put('/', async (ctx, next) => {
//   const params = await new WecValidator().validate(ctx)
//   const entity = Entitys[params.model]
//   const result = await entity.updateData(params)
//   ctx.body = {
//     result
//   }
// })

// router.delete('/', async (ctx, next) => {
//   const params = await new PositiveIntegerValidator().validate(ctx)
//   const entity = Entitys[params.model]
//   const msg = await entity.deleteById(params.id)
//   ctx.body = {
//     msg
//   }
// })


module.exports = router